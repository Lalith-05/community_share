import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const currentUser =
    await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const user =
    await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
    });

  return NextResponse.json(
    user
  );
}

export async function PATCH(
  request: Request
) {

  const currentUser =
    await getCurrentUser();

  if (!currentUser) {

    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const body =
    await request.json();

  const {
    name,
    bio,
    location,
    profileImage,
  } = body;

  const updatedUser =
    await prisma.user.update({
      where: {
        id: currentUser.id,
      },

      data: {
        name,
        bio,
        location,
        profileImage,
      },
    });

  return NextResponse.json(
    updatedUser
  );
}