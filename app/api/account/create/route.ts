import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
type RequestBody = {
    id: number,
    name: string,
    tagName: string,
    description: string,
    avatarLink: string | undefined,
    bannerLink: string | undefined
}

export async function POST(req: NextRequest) {
    const body: RequestBody = await req.json()
    if (body) {
        const data = await prisma.account.update({
            data: {
                avatarLink: body.avatarLink || 'https://file.lyart.pro.vn/api/image/avatar?id=-1',
                bannerLink: body.bannerLink || 'https://file.lyart.pro.vn/api/image/banner?id=-1',
                name: body.name,
                tagName: body.tagName,
                description: body.description,
            },
            where: {
                id: body.id
            }
        })

        return new Response(JSON.stringify(data))
    } else {
        return new Response(JSON.stringify({ message: 'missing data' }))
    }

}