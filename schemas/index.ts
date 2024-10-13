import * as z from 'zod';

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Mật khẩu phải có ít nhất 6 ký tự"
    }),
});

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
    }),
    code: z.optional(z.string()),
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

export const CourseSchemaTitle = z.object({
    title: z.string().min(1, {
        message: "Yêu cầu nhập tiêu đề"
    }),
})

export const CourseSchemaImage = z.object({
    imageSrc: z.string().min(1, {
        message: "Yêu cầu nhập ảnh"
    }),
})

export const CourseSchemaUnits = z.object({
    title: z.string().min(1),
})

export const UnitSchemaTitle = z.object({
    title: z.string().min(1, {
        message: "Yêu cầu nhập tiêu đề"
    }),
})

export const UnitSchemaDescription = z.object({
    description: z.string().min(1, {
        message: "Yêu cầu nhập mô tả"
    }),
})

export const UnitSchemaLesson = z.object({
    title: z.string().min(1),
})

export const LessonSchemaTitle = z.object({
    title: z.string().min(1, {
        message: "Yêu cầu nhập tiêu đề"
    }),
})

export const ChallengeSchemaQuestion = z.object({
    question: z.string().min(1, {
        message: "Yêu cầu nhập câu hỏi"
    }),
})

export const ChallengeSchemaType = z.object({
    type: z.string().min(1, {
        message: "Yêu cầu chọn loại"
    }),
})

export const ChallengeSchemaDifficultLevel = z.object({
    difficultLevel: z.coerce.number().min(1, {
        message: "Yêu cầu chọn mức độ"
    }),
})

export const ChallengeSchemaChallengeOption = z.object({
    text: z.string().min(1, {
        message: "Yêu cầu nhập câu trả lời"
    }),
})

export const ChallengeOptionSchemaCorrect = z.object({
    correct: z.boolean(),
})

export const ChallengeOptionSchemaImageSrc = z.object({
    imageSrc: z.string().min(1, {
        message: "Yêu cầu nhập ảnh"
    }),
})

export const ChallengeOptionSchemaAudioSrc = z.object({
    audioSrc: z.string().min(1, {
        message: "Yêu cầu nhập âm thanh"
    }),
})