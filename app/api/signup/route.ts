import { baseURL, fileURL } from "@/lib/functional";
import { signJWTToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
type RequestBody = {
    username: string,
    email: string,
    password: string
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json();
    if (body.username === undefined || body.email === undefined || body.password === undefined) {
        return new Response('Invalid', { status: 400 })
    }

    const user = await prisma.account.findFirst({
        where: {
            username: body.username
        }
    })

    if (user) {
        return new Response(JSON.stringify({ message: 'username already exist' }), { status: 406 })
    } else {
        try {
            const user = await prisma.account.create({
                data: {
                    username: body.username,
                    email: body.email,
                    // password: await bcrypt.hash(body.password, 10),
                    password: body.password,
                    name: body.username,
                    streamKey: uuid(),
                }
            })
            const userId = user.id;

            // Cập nhật lại avatarLink với ID của tài khoản
            await prisma.account.update({
                where: { id: userId },
                data: {
                    avatarLink: `${fileURL}/image/avatar?id=${userId}`
                }
            });
            if (user) {
                const { password, ...userWithoutPassword } = user;
                return new Response(JSON.stringify(userWithoutPassword), { status: 201 })
            } else {
                return new Response(JSON.stringify(null), { status: 406 })
            }

        } catch (error) {
            return new Response(JSON.stringify({ message: 'error creating account' }), { status: 500 })
        }

    }
}
