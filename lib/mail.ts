import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (
    email: string,
    token: string
) => {
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`

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
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Xác thực tài khoản",
        html: `<p>Click <a href="${confirmLink}">vào đây</a> để xác thực email.</p>`
    })
}