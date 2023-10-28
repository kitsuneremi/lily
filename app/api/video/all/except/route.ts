import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(req: NextRequest) {
    const searchParam = req.nextUrl.searchParams;
    const videoId = searchParam.get('videoId');
    if (videoId && Number.parseInt(videoId)) {
        const allVideos = await prisma.videos.findMany()

        const videos = allVideos.filter(video => video.id !== Number.parseInt(videoId));

        return new NextResponse(JSON.stringify(videos), { status: 200 });
    }
}