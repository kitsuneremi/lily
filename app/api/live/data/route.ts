import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const searchParams = req.nextUrl.searchParams;

    const tag = searchParams.get("tag");
    if (tag) {
        const channel = await prisma.channels.findUnique({
            where: {
                tagName: tag
            }
        })

        if (channel) {
            const live = await prisma.media.findFirst({
                where: {
                    channelId: channel.id,
                    AND: {
                        mediaType: 1
                    }
                }
            })

            if (live) {
                return new NextResponse(JSON.stringify(live), { status: 200 })
            } else {
                // const lastLive = await prisma.media.findFirst({
                //     where: {
                //         channelId: channel.id,
                //         AND: {
                //             mediaType: 2,
                //             createdTime: {
                //                 gte: new Date(Date.now() - 10 * 60 * 1000)
                //             }
                //         }
                //     }
                // })
                // if (lastLive) {
                //     return new NextResponse(JSON.stringify(lastLive), { status: 200 })
                // } else {
                //     return new NextResponse(JSON.stringify(null), { status: 404 })
                // }
                return new NextResponse(JSON.stringify(null), { status: 404 })
            }
        } else {
            return new NextResponse(null, { status: 400 })
        }

    } else {
        return new NextResponse(null, { status: 400 })
    }
}