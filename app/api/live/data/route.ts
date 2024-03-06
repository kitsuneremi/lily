import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const searchParams = req.nextUrl.searchParams;

    const tag = searchParams.get("tag");
    if (tag) {
        const channel = await prisma.account.findUnique({
            where: {
                tagName: tag
            }
        })

        if (channel) {
            const live = await prisma.media.findFirst({
                where: {
                    accountId: channel.id,
                    AND: {
                        mediaType: 1
                    }
                }
            })

            if (live) {
                return new NextResponse(JSON.stringify(live), { status: 200 })
            } else {
                return new NextResponse(JSON.stringify(null), { status: 404 })
            }
        } else {
            return new NextResponse(null, { status: 400 })
        }

    } else {
        return new NextResponse(null, { status: 400 })
    }
}