import * as z from 'zod';

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email là bắt buộc"
    }),
});

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email là bắt buộc"
    }),
    password: z.string().min(1, {
        message: "Mật khẩu là bắt buộc"
    })
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email là bắt buộc"
    }),
    password: z.string().min(6, {
        message: "Mật khẩu phải có ít nhất 6 ký tự"
    }),
    name: z.string().min(1, {
        message: "Yêu cầu nhập tên"
    })
});