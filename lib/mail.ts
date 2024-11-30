import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL!;

export const sendPasswordResetEmail = async (
    email: string,
    token: string
) => {
    const resetLink = `${domain}/auth/new-password?token=${token}`

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Đặt lại mật khẩu",
        html: `<p>Click <a href="${resetLink}">vào đây</a> để đặt lại mật khẩu`,
    })
};

export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Xác thực tài khoản",
        html: `<p>Click <a href="${confirmLink}">vào đây</a> để xác thực email.</p>`
    })
}