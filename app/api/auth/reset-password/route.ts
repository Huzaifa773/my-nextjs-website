import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  token: z.string().min(10),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.errors[0]?.message || "Invalid input",
        },
        { status: 400 }
      );
    }

    const { email, token, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    // VerificationToken uses `token` as its primary key
    const record = await prisma.verificationToken.findUnique({
      where: { token },
    });

    // Check token existence, expiry, and email/identifier
    if (
      !record ||
      record.identifier.toLowerCase() !== normalizedEmail ||
      record.expires < new Date()
    ) {
      return NextResponse.json(
        {
          error: "This reset link is invalid or has expired",
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update user's password
    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { passwordHash },
    });

    // Invalidate the token so it cannot be reused
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({
      message: "Password updated. You can now log in.",
    });
  } catch (err) {
    console.error("Reset password error:", err);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
