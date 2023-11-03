import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { ChannelDataType, VideoDataType } from "@/types/type";
export async function GET(req: NextRequest) {
    const searchParam = req.nextUrl.searchParams;
    const videoId = searchParam.get('videoId');

    const list = []
    if (videoId && Number.parseInt(videoId)) {
        const allVideos = await prisma.videos.findMany({
            where: {
                id: {
                    not: Number.parseInt(videoId)
                }
            },
            include: {
                channel: true
            }
        })

        for (const video of allVideos) {
            const thumbnailRef = ref(storage, `/video/thumbnails/${video.link}`)
            const channelAvatarRef = ref(storage, `/channel/avatars/${video.channel.tagName}`)
            const [thumbnailUrl, channelAvatarUrl] = await Promise.all([getDownloadURL(thumbnailRef), getDownloadURL(channelAvatarRef)])
            const { channel, ...vid } = video
            const videoData: { videoData: VideoDataType, channelData: ChannelDataType } = { videoData: { thumbnail: thumbnailUrl, ...vid }, channelData: { avatarImage: channelAvatarUrl, ...channel } }
            list.push(videoData)
        }

        return new NextResponse(JSON.stringify(list), { status: 200 });
    }
} 