'use server';
import prisma from "@/lib/prisma";
import { loginSchema } from "@/schema/Schema"
import { z } from 'zod'
import { compare } from 'bcrypt'
import { signIn } from "@/auth";
import { AuthError } from "next-auth";


export const login = async (values: z.infer<typeof loginSchema>) => {
    console.log(values);
    const validatedFields = loginSchema.safeParse(values);
    if (!validatedFields) {
        return { error: 'sai thông tin' }
    } else {
        const account = await prisma.account.findFirst({
            where: {
                username: values.username,
            }
        })

        if (!account) return { error: 'tên đăng nhập không tồn tại' }
        if (!account.password) return { error: 'sai phương thức đăng nhập' }
        if (!await compare(values.password, account.password)) return { error: 'sai mật khẩu' }

        const { username, password } = account;
        try {
            const res = await signIn('credentials', {
                username, password: values.password, redirectTo: '/'
            })
            await Response.redirect(new URL('/'))
            return { success: 'ok' }
        } catch (error) {
            if (error instanceof AuthError) {
                switch (error.type) {
                    case "CredentialsSignin":
                        return { error: 'invalid credentials' }
                    default:
                        return { error: 'lỗi chưa xác định' }
                }
            }
        }
    }
}