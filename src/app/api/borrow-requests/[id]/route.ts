import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const body = await request.json();
    const { status } = body;

    // Only allow valid status changes
    if (status !== "APPROVED" && status !== "REJECTED") {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Get the request being updated
    const borrowRequest = await prisma.borrowRequest.findUnique({
      where: {
        id,
      },
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

    // If approving, check whether the requested dates
    // overlap with another approved booking.
    if (status === "APPROVED") {
      const overlappingRequest =
        await prisma.borrowRequest.findFirst({
          where: {
            itemId: borrowRequest.itemId,

            status: "APPROVED",

            // Ignore the current request
            id: {
              not: id,
            },

            // Overlap condition:
            // existing.start < requested.end
            // AND
            // existing.end > requested.start
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

    // Update only the borrow request.
    // We DO NOT change item.availability here.
    const updatedRequest =
      await prisma.borrowRequest.update({
        where: {
          id,
        },
        data: {
          status,
        },
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