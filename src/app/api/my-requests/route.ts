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

  const requests = await prisma.borrowRequest.findMany({
    where: {
      borrowerId: currentUser.id,
    },
    include: {
      item: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(requests);
}