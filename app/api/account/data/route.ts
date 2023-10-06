import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {

    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    if (id) {
        const account = await prisma.accounts.findUnique({
            where: {
                id: Number.parseInt(id)
            }
        })
        if (account) {
            const { password, ...userWithoutPass } = account

            return new NextResponse(JSON.stringify(userWithoutPass), { status: 201 })
        } else {
            return new NextResponse(JSON.stringify({
                message: 'cannot find user'
            }), { status: 404 })
        }

    } else {
        return new NextResponse(JSON.stringify({
            message: 'error'
        }), {
            status: 403
        })
    }
}