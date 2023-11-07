import { storage } from "@/lib/firebase";
import prisma from "@/lib/prisma";
import { ref, getDownloadURL } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const searhParams = req.nextUrl.searchParams;
    const videoId = searhParams.get("videoId");
    const commentx = [];
    if (videoId) {
        const comments = await prisma.comment.findMany({
            where: {
                mediaId: Number.parseInt(videoId)
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        for (const comment of comments) {
            const accountRef = ref(storage, `/account/avatars/${comment.accountId}`)
            try {
                const accountUrl = await getDownloadURL(accountRef);
                commentx.push({ accountImage: accountUrl, ...comment })
            } catch (error) {

                commentx.push({ accountImage: null, ...comment })
            }

        }

        return new NextResponse(JSON.stringify(commentx), { status: 200 })
    } else {
        return new NextResponse(JSON.stringify({ message: "videoId is not found" }), { status: 400 })
    }
}