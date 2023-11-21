import prisma from "@/lib/prisma";
import { MediaDataType, BigVideoDataType, ChannelDataType, CommentDataType } from "@/types/type";
import { getDownloadURL, ref } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/firebase";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const channelId = searchParams.get('channelId');
    const list: BigVideoDataType[] = [];

    if (channelId) {
        const videos = await prisma.media.findMany({
            where: {
                channelId: Number.parseInt(channelId)
            },
            orderBy: {
                view: 'desc'
            },
            take: 10
        })

        if (videos) {
            for (const video of videos) {
                const like = await prisma.likes.count({
                  where: {
                    mediaId: video.id,
                  },
                });
            
                const commentCount = await prisma.comment.count({
                  where: {
                    mediaId: video.id
                  }
                })
            
                const channel = await prisma.channels.findUnique({
                  where: {
                    id: video.channelId,
                  },
                });
            
                const comment = await prisma.comment.findMany({
                  where: {
                    mediaId: video.id,
                  },
                });
            
            
                if (channel && comment) {
                  if(video.mediaType == 1 || video.mediaType == 2){
                    const avatarRef = ref(storage, `/channel/avatars/${channel.tagName}`)
                    const videoThumbnailRef = ref(storage, `/channel/avatars/${channel.tagName}`)
                    const [videoThumbnail, avatarImage] = await Promise.all([getDownloadURL(videoThumbnailRef), getDownloadURL(avatarRef)])
                    const channelData: ChannelDataType = { sub: 0, avatarImage, bannerImage: '', ...channel };
                    const commentData: CommentDataType[] = comment;
              
                    const videoData: MediaDataType = { like, thumbnail: videoThumbnail, comment: commentCount, ...video };
                    const t: BigVideoDataType = {
                      videoData,
                      channelData,
                      commentData,
                    };
              
                    list.push(t);
                  }else{
                    const avatarRef = ref(storage, `/channel/avatars/${channel.tagName}`)
                    const videoThumbnailRef = ref(storage, `/video/thumbnails/${video.link}`)
                    const [videoThumbnail, avatarImage] = await Promise.all([getDownloadURL(videoThumbnailRef), getDownloadURL(avatarRef)])
                    const channelData: ChannelDataType = { sub: 0, avatarImage, bannerImage: '', ...channel };
                    const commentData: CommentDataType[] = comment;
              
                    const videoData: MediaDataType = { like, thumbnail: videoThumbnail, comment: commentCount, ...video };
                    const t: BigVideoDataType = {
                      videoData,
                      channelData,
                      commentData,
                    };
              
                    list.push(t);
                  }
            
                }
              }
            return new NextResponse(JSON.stringify(list))
        } else {
            return new NextResponse(null, { status: 204 })
        }


    } else {
        return new NextResponse(JSON.stringify({ message: '???' }), { status: 403 })
    }
} 