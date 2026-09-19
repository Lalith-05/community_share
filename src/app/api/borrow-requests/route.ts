import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      itemId,
      startDate,
      endDate,
      message,
    } = body;

    // Validate required fields
    if (!itemId || !startDate || !endDate) {
      return NextResponse.json(
        {
          error: "Item, start date and end date are required",
        },
        { status: 400 }
      );
    }

    // Convert dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return NextResponse.json(
        { error: "Invalid start or end date" },
        { status: 400 }
      );
    }

    // Start must be before end
    if (start >= end) {
      return NextResponse.json(
        {
          error: "End date must be after start date",
        },
        { status: 400 }
      );
    }

    // Prevent past bookings
    const now = new Date();

    if (start < now) {
      return NextResponse.json(
        {
          error: "Start date cannot be in the past",
        },
        { status: 400 }
      );
    }

    // Find item
    const item = await prisma.item.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    // Check item availability
    if (!item.availability) {
      return NextResponse.json(
        {
          error: "This item is currently unavailable",
        },
        { status: 400 }
      );
    }

    // Owner cannot borrow their own item
    if (item.ownerId === currentUser.id) {
      return NextResponse.json(
        {
          error: "You cannot borrow your own item",
        },
        { status: 400 }
      );
    }

    // Calculate borrowing duration
    const borrowDays = Math.ceil(
      (end.getTime() - start.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Check maximum borrowing period
    if (borrowDays > item.maxBorrowDays) {
      return NextResponse.json(
        {
          error: `Maximum borrowing period is ${item.maxBorrowDays} days`,
        },
        { status: 400 }
      );
    }

    // Prevent duplicate active requests
    const existingRequest =
      await prisma.borrowRequest.findFirst({
        where: {
          itemId,
          borrowerId: currentUser.id,
          status: {
            in: ["PENDING", "APPROVED"],
          },
        },
      });

    if (existingRequest) {
      return NextResponse.json(
        {
          error:
            "You already have an active request for this item",
        },
        { status: 400 }
      );
    }

    // Prevent overlapping approved bookings
    const overlappingRequest =
      await prisma.borrowRequest.findFirst({
        where: {
          itemId,
          status: "APPROVED",

          startDate: {
            lt: end,
          },

          endDate: {
            gt: start,
          },
        },
      });

    if (overlappingRequest) {
      return NextResponse.json(
        {
          error:
            "This item is already booked for the selected dates",
        },
        { status: 409 }
      );
    }

    // Create request
    const request =
      await prisma.borrowRequest.create({
        data: {
          itemId,
          borrowerId: currentUser.id,
          startDate: start,
          endDate: end,
          message:
            typeof message === "string"
              ? message.trim() || null
              : null,
        },
      });

    return NextResponse.json(request, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "Create borrow request error:",
      error
    );

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}