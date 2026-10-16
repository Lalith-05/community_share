import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verify authentication
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // 2. Get the borrowing request ID
    const { id } = await context.params;

    // 3. Validate the requested status
    let body: { status?: unknown };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const { status } = body;

    if (status !== "APPROVED" && status !== "REJECTED") {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // 4. Retrieve the borrowing request and its item
    const borrowRequest = await prisma.borrowRequest.findUnique({
      where: { id },
      include: {
        item: true,
      },
    });

    if (!borrowRequest) {
      return NextResponse.json(
        { error: "Borrow request not found" },
        { status: 404 }
      );
    }

    // 5. Only the item owner can approve or reject
    if (borrowRequest.item.ownerId !== currentUser.id) {
      return NextResponse.json(
        { error: "You are not authorized to manage this request" },
        { status: 403 }
      );
    }

    // 6. Only pending requests can be processed
    if (borrowRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "This request has already been processed" },
        { status: 409 }
      );
    }

    // 7. Prevent overlapping approved bookings
    if (status === "APPROVED") {
      const overlappingRequest =
        await prisma.borrowRequest.findFirst({
          where: {
            itemId: borrowRequest.itemId,
            status: "APPROVED",
            id: {
              not: id,
            },
            startDate: {
              lt: borrowRequest.endDate,
            },
            endDate: {
              gt: borrowRequest.startDate,
            },
          },
        });

      if (overlappingRequest) {
        return NextResponse.json(
          {
            error:
              "These dates are already booked by another approved request",
          },
          { status: 400 }
        );
      }
    }

    // 8. Update the request
    const updatedRequest = await prisma.borrowRequest.update({
      where: { id },
      data: { status },
      include: {
        item: true,
      },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Borrow request update error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}