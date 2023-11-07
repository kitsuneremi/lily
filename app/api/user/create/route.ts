import prisma from "@/lib/prisma";
import * as bcrypt from 'bcrypt';
import {v4 as uuid} from "uuid"
interface RequestBody {
    name: string;
    email: string;
    password: string;
    username: string;
    isAdmin: Boolean;
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json();
    const user = await prisma.accounts.create({
        data: {
            name: body.name,
            email: body.email,
            username: body.username,
            password: await bcrypt.hash(body.password, 10),
            streamKey: uuid(),

        }
    });

    const { password, ...userWithoutPassword } = user;
    return new Response(JSON.stringify(userWithoutPassword))
}