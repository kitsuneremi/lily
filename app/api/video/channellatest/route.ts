import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const channelId = searchParams.get('channelId');

    if (channelId) {
        const lastestVideo = await prisma.media.findFirst({
            where: {
                accountId: Number.parseInt(channelId)
            },
            orderBy: {
                createdTime: 'desc'
            }
        })



        if (lastestVideo) {
            const like = await prisma.likes.count({
                where: {
                    mediaId: lastestVideo.id
                }
            })

            const comment = await prisma.comment.count({
                where: {
                    mediaId: lastestVideo.id
                }
            })
            const videoData = { like: like, comment: comment, ...lastestVideo }

            return new NextResponse(JSON.stringify(videoData))
        } else {
            return new NextResponse(null, { status: 204 })
        }

    } else {
        return new NextResponse(JSON.stringify({ message: 'invalid params' }), { status: 403 })
    }

}