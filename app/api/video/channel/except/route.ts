import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const searchParam = req.nextUrl.searchParams;
    const videoId = searchParam.get('videoId');
    const channelId = searchParam.get('channelId');
    if (videoId && Number.parseInt(videoId) && channelId && Number.parseInt(channelId)) {
        const allVideos = await prisma.videos.findMany({
            where: {
                channelId: Number.parseInt(channelId),
            }
        })

        const videos = allVideos.filter(video => video.id !== Number.parseInt(videoId));

        return new NextResponse(JSON.stringify(videos), { status: 200 });
    } else {
        return new NextResponse(JSON.stringify({ 'message': '????' }), { status: 400 });
    }
}