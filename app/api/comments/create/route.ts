import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

type CommentBody = {
    videoId: number,
    accountId: number,
    content: string
}

export async function POST(req: NextRequest, res: NextResponse) {
    const body: CommentBody = await req.json();
    const { videoId, accountId, content } = body;
    if (videoId && accountId && content) {
        const cmt = await prisma.comment.create({
            data: {
                content: content,
                accountId: accountId,
                mediaId: videoId,
                referenceId: null,
                status: 0
            }
        })

        const listComment = await prisma.comment.findMany({
            where: {
                mediaId: videoId
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return new NextResponse(JSON.stringify(listComment), { status: 201 })
    } else {
        return new NextResponse(JSON.stringify(null), { status: 400 })
    }
}