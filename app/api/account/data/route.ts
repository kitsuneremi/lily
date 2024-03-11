import { storage } from "@/lib/firebase";
import prisma from "@/lib/prisma"
import { compare } from 'bcrypt'
import { NextRequest, NextResponse } from "next/server";
import { signJWTToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {

    const body = await req.json();
    const username = body.username;
    const password = body.password;
    if (!username) return new NextResponse(JSON.stringify({ 'error': 'chưa cung cấp tên đăng nhập' }))
    if (!password) return new NextResponse(JSON.stringify({ 'error': 'chưa cung cấp mật khẩu' }))

    const user = await prisma.account.findFirst({
        where: {
            OR: [
                {
                    username: username
                },
                {
                    email: username
                }
            ]
        }
    });


    if (!user) return new NextResponse(JSON.stringify({ error: 'tên đăng nhập hoặc email không tồn tại' }));
    if (!user.password || user.provider != 'credentials') return new NextResponse(JSON.stringify({ error: `bạn hãy đăng nhập với ${user.provider}` }));
    if (await compare(password, user.password)) {
        const { password, ...UserWithoutPass } = user
        const accessToken = signJWTToken(UserWithoutPass)
        const result = {
            ...UserWithoutPass,
            accessToken
        }
        return new NextResponse(JSON.stringify(result));
    } else {
        return new NextResponse(JSON.stringify({ error: 'sai mật khẩu'}));
    }
}