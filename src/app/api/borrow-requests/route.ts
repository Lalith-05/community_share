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

    const request = await prisma.borrowRequest.create({
      data: {
        itemId,
        borrowerId: currentUser.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        message,
      },
    });

    return NextResponse.json(request);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}