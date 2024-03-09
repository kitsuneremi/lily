"use server"
import prisma from "@/lib/prisma";
import { registerSchema } from "@/schema/Schema"
import { z } from 'zod'
import { compare, hash } from 'bcrypt'
import { signIn } from 'next-auth/react'
import { AuthError } from "next-auth";

export const register = async (values: z.infer<typeof registerSchema>) => {
    const validatedFields = registerSchema.safeParse(values);
    if (!validatedFields) {
        return { error: 'sai thông tin' }
    } else {
        const findAccount = await prisma.account.findFirst({
            where: {
                OR: [
                    { email: values.email, username: values.username },
                ]
            }
        })

        if (findAccount) return { error: 'tên đăng nhập hoặc email đã được sử dụng' }
        const newAccount = await prisma.account.create({
            data: {
                email: values.email,
                name: values.username,
                username: values.username,
                provider: 'credentials',
                password: await hash(values.password, 10),
            }
        })

        console.log(newAccount);
        const { username, password, ...data } = newAccount;
        try{
            await signIn('credentials', {
                username, password, redirectTo: '/'
            })
        }catch(error){
            if(error instanceof AuthError){
                switch(error.type){
                    case "CredentialsSignin": 
                    return {error: 'invalid credentials'}
                    default: 
                    return {error: 'lỗi chưa xác định'} 
                }
            }
        }
    }
}