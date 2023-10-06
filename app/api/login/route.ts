import { signJWTToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";

interface RequestBody {
    username: string;
    password: string;
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json();

    const user = await prisma.accounts.findFirst({
        where: {
            username: body.username,

        }
    })

    if (user && body.password == user.password) {
        const { password, ...UserWithoutPass } = user
        const accessToken = signJWTToken(UserWithoutPass)
        const result = {
            ...UserWithoutPass,
            accessToken
        }
        return new Response(JSON.stringify(result))
    } else {
        return new Response(JSON.stringify(null));
    }
}

