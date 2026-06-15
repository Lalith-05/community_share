import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const body = await request.json();

  const { status } = body;

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

if (status === "APPROVED") {
  await prisma.item.update({
    where: {
      id: updatedRequest.item.id,
    },
    data: {
      availability: false,
    },
  });
}

  return NextResponse.json(updatedRequest);
}