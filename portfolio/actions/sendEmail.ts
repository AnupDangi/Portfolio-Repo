"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
        return { error: "Please fill in all fields." };
    }

    try {
        // 1. Notify the site owner
        const { error: ownerError } = await resend.emails.send({
            from: "Portfolio <info@anupdangi.com.np>", // Usually needs to be a verified domain like info@anupdangi.com.np
            to: "anupdangi1589@gmail.com",
            replyTo: email,
            subject: `New message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        });

        if (ownerError) return { error: ownerError.message };

        // 2. Auto-reply to the visitor
        // Note: Auto-reply works only if you have a verified custom domain on Resend.
        // If you haven't verified a domain yet, this might fail when sending to an arbitrary visitor email.
        await resend.emails.send({
            from: "Anup Dangi <info@anupdangi.com.np>",
            to: email,
            subject: "I received your message!",
            text: `Hi ${name},\n\nThank you for reaching out! I'll get back to you soon.\n\nYour message:\n${message}\n\nBest,\nAnup Dangi`,
        });

        return { success: true };
    } catch (err: any) {
        return { error: err.message || "Failed to send email" };
    }
};
