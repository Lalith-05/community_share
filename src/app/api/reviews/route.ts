import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {

  const currentUser =
    await getCurrentUser();

  if (!currentUser) {

    return NextResponse.json(
      {
        error:
          "Unauthorized",
      },

      {
        status: 401,
      }
    );
  }

  const body =
    await request.json();

  const {
    itemId,
    rating,
    comment,
  } = body;

  const review =
    await prisma.review.create({

      data: {

        itemId,

        reviewerId:
          currentUser.id,

        rating,

        comment,

      },

    });

  return NextResponse.json(
    review
  );
}

export async function GET(
  request: Request
) {

  const { searchParams } =
    new URL(request.url);

  const itemId =
    searchParams.get(
      "itemId"
    );

  const reviews =
    await prisma.review.findMany({

      where: {
        itemId:
          itemId || "",
      },

      include: {
        reviewer: true,
      },

      orderBy: {
        createdAt:
          "desc",
      },

    });

  return NextResponse.json(
    reviews
  );
}