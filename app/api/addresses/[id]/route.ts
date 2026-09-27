import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: {
    id: string;
  };
};

async function getOwnedAddress(id: string, userId: string) {
  const address = await prisma.address.findUnique({
    where: { id },
  });

  if (!address || address.userId !== userId) {
    return null;
  }

  return address;
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const address = await getOwnedAddress(params.id, userId);

    if (!address) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // If this address is being made default,
    // remove default status from the user's other addresses.
    if (body.isDefault === true) {
      await prisma.address.updateMany({
        where: {
          userId,
          id: {
            not: params.id,
          },
        },
        data: {
          isDefault: false,
        },
      });
    }

    const updated = await prisma.address.update({
      where: {
        id: params.id,
      },
      data: body,
    });

    return NextResponse.json({
      address: updated,
    });
  } catch (error) {
    console.error("Update address error:", error);

    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const address = await getOwnedAddress(params.id, userId);

    if (!address) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    await prisma.address.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete address error:", error);

    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}

