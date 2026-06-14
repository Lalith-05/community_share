import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const myItems = await prisma.item.count({
    where: {
      ownerId: currentUser.id,
    },
  });

  const incomingRequests =
    await prisma.borrowRequest.count({
      where: {
        item: {
          ownerId: currentUser.id,
        },
      },
    });

  const outgoingRequests =
    await prisma.borrowRequest.count({
      where: {
        borrowerId: currentUser.id,
      },
    });

  const approvedRequests =
    await prisma.borrowRequest.count({
      where: {
        borrowerId: currentUser.id,
        status: "APPROVED",
      },
    });

  return NextResponse.json({
    myItems,
    incomingRequests,
    outgoingRequests,
    approvedRequests,
  });
}