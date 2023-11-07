import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { ChannelDataType, MediaDataType } from "@/types/type";
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
                Channels: true
            }
        })

        for (const video of allVideos) {
            const thumbnailRef = ref(storage, `/video/thumbnails/${video.link}`)
            const channelAvatarRef = ref(storage, `/channel/avatars/${video.Channels.tagName}`)
            const [thumbnailUrl, channelAvatarUrl] = await Promise.all([getDownloadURL(thumbnailRef), getDownloadURL(channelAvatarRef)])
            const { Channels, ...vid } = video
            const videoData: { videoData: MediaDataType, channelData: ChannelDataType } = { videoData: { thumbnail: thumbnailUrl, ...vid }, channelData: { avatarImage: channelAvatarUrl, ...Channels } }
            list.push(videoData)
        }

        return new NextResponse(JSON.stringify(list), { status: 200 });
    }
} 