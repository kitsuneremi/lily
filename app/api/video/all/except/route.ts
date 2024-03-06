import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(req: NextRequest) {
    const searchParam = req.nextUrl.searchParams;
    const videoId = searchParam.get('videoId');

    const list = []
    if (videoId && Number.parseInt(videoId)) {
        const allVideos = await prisma.media.findMany({
            where: {
                id: {
                    not: Number.parseInt(videoId)
                },
                AND:{
                    mediaType: 0
                }
            },
            include: {
                Account: true
            }
        })
        return new NextResponse(JSON.stringify(allVideos), { status: 200 });
    }
} 