import { NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, instagram, message } = body;

    if (resend && process.env.ADMIN_EMAIL) {
      const emailHtml = `
        <h1>New Community Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Instagram:</strong> ${instagram || 'N/A'}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `;

      await resend.emails.send({
        from: 'Malvie Community <notifications@malvie.lk>',
        to: [process.env.ADMIN_EMAIL],
        subject: `New Community Submission from ${name}`,
        html: emailHtml,
      });
    } else {
      console.warn("Resend API key or Admin Email not set. Skipping email notification.");
    }

    return NextResponse.json({ success: true, message: "Community submission received successfully" }, { status: 200 });
  } catch (error) {
    console.error("Community submission error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
