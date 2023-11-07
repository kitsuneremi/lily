import prisma from "@/lib/prisma";
import { BigVideoDataType, ChannelDataType, CommentDataType, MediaDataType } from "@/types/type";
import { getDownloadURL, ref } from "firebase/storage";
import { type NextRequest } from "next/server";
import { storage } from "@/lib/firebase";

export async function GET(req: NextRequest) {
  const list: BigVideoDataType[] = [];
  const videos = await prisma.media.findMany();

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

  return new Response(JSON.stringify(list), { status: 200 });
}