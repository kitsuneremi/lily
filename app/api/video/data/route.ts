import { storage } from "@/lib/firebase";
import prisma from "@/lib/prisma";
import { BigVideoDataType } from "@/types/type";
import { ref, getDownloadURL } from "firebase/storage";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const link = searchParams.get('link');

    console.log(link)

    if (link) {
        const videoData = await prisma.videos.findFirst({
            where: {
                link: link
            }
        })
        if (videoData) {
            const likeCount = await prisma.likes.count({
                where: {
                    videoId: videoData.id,
                    type: 0
                }
            })
            const commentFetch = prisma.comment.findMany({
                where: {
                    videoId: videoData.id
                },
                orderBy: {
                    createdAt: "desc"
                }
            })

            const channelFetch = prisma.channels.findFirst({
                where: {
                    id: videoData.channelId
                }
            })

            const [commentData, channelData] = await Promise.all([commentFetch, channelFetch])
            const subCount = await prisma.subcribes.count({
                where: {
                    channelId: channelData?.id
                }
            })

            const channelAvatarRef = ref(storage, `/channel/avatars/${channelData?.tagName}`)
            const channelAvatarUrl = await getDownloadURL(channelAvatarRef)

            const temp:BigVideoDataType = { videoData: { ...videoData, like: likeCount }, channelData: { ...channelData, sub: subCount, avatarImage: channelAvatarUrl}, commentData }

            return new NextResponse(JSON.stringify(temp), { status: 200 })
        } else {
            return new NextResponse(JSON.stringify({}))
        }
    } else {
        return new NextResponse(JSON.stringify({ message: 'invalid video link' }), { status: 404 })
    }

}