import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } =
    new URL(req.url);

  const category =
  searchParams.get("category") || "";

    const search =
    searchParams.get("search") || "";

  const items = await prisma.item.findMany({
    where: {
  AND: [
    {
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },

    category
      ? {
          category: {
            name: category,
          },
        }
      : {},
  ],
},
include: {
  owner: true,
  category: true,
}
  });

  return NextResponse.json(items);
}

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
      title,
      description,
      imageUrls,
      categoryId,
      maxBorrowDays,
      depositAmount,
    } = body;

    const item = await prisma.item.create({
      data: {
        title,
        description,
        imageUrls,
        categoryId,
        maxBorrowDays: Number(maxBorrowDays),
        depositAmount:
          depositAmount === ""
            ? null
            : Number(depositAmount),

        ownerId: currentUser.id,
      },
    });

    return NextResponse.json(item);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}