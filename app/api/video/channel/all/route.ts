import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest, res: NextResponse) {
    const searchParams = req.nextUrl.searchParams;
    const channelId = searchParams.get("channelId");

    if (channelId && Number.parseInt(channelId)) {
        const videos = await prisma.media.findMany({
            where: {
                channelId: Number.parseInt(channelId),
                AND:{
                    mediaType: 0
                }
            }
        })

        return new NextResponse(JSON.stringify(videos), { status: 200 });
    } else {
        return new NextResponse(JSON.stringify({ error: "channelId is required" }), { status: 400 });
    }
}