import prisma from "@/lib/prisma";
import { VideoDataType } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const channelId = searchParams.get('channelId');

    if (channelId) {
        const video = await prisma.videos.findMany({
            where: {
                channelId: Number.parseInt(channelId)
            },
            orderBy: {
                view: 'desc'
            },
            take: 10
        })

        if (video) {
            return new NextResponse(JSON.stringify(video as VideoDataType[]))
        } else {
            return new NextResponse(null, { status: 204 })
        }


    } else {
        return new NextResponse(JSON.stringify({ message: '???' }), { status: 403 })
    }
}