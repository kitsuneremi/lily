import { z } from 'zod'
export const loginSchema = z.object({
    username: z.string().min(4, {
        message: "Tối thiểu 4 ký tự"
    }),
    password: z.string().min(1, {
        message: 'Mật khẩu không được để trống'
    })
})

export const registerSchema = z.object({
    email: z.string().min(4, {
        message: "Tối thiểu 4 ký tự"
    }).email(),
    username: z.string().min(4, {
        message: "Tối thiểu 4 ký tự"
    }),
    password: z.string().min(1, {
        message: 'Mật khẩu không được để trống'
    }),
    confirmPassword: z.string().min(1, {
        message: 'Mật khẩu không được để trống'
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: 'mật khẩu chưa trùng khớp',
    path: ['confirmPassword']
})