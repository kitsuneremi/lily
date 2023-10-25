import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const searhParams = req.nextUrl.searchParams;
    const videoId = searhParams.get("videoId");

    if (videoId) {
        const comments = await prisma.comment.findMany({
            where: {
                videoId: Number.parseInt(videoId)
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return new NextResponse(JSON.stringify(comments), { status: 200 })
    } else {
        return new NextResponse(JSON.stringify({ message: "videoId is not found" }), { status: 400 })
    }
}