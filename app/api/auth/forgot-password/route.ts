export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().email() });

// NOTE: This project has no SMTP/email service configured. In development,
// the reset link is logged to the server console so you can copy it manually.
// Before going to production, wire this up to a real email provider (e.g.
// Resend, SendGrid, or SMTP via nodemailer) and send the link by email
// instead of ever returning it in the API response.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return a generic success message, even if the user doesn't
    // exist â€” this prevents attackers from discovering which emails are
    // registered (user enumeration).
    if (!user) {
      return NextResponse.json({
        message: "If an account exists for this email, a reset link has been created.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // eslint-disable-next-line no-console
    console.log(`\n[Password Reset] Link for ${email}:\n${resetUrl}\n`);

    return NextResponse.json({
      message: "If an account exists for this email, a reset link has been created.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

