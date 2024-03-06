import { signJWTToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";

interface RequestBody {
    username: string;
    password: string;
}

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const user = await prisma.account.findFirst({
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
            return new Response(JSON.stringify({ message: 'wrong username or password' }));
        }
    } catch (e) {
        return new Response(JSON.stringify({ message: 'sth error' }));
    }


}

