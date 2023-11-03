import prisma from "@/lib/prisma";
import { VideoDataType, BigVideoDataType, ChannelDataType, CommentDataType } from "@/types/type";
import { getDownloadURL, ref } from "firebase/storage";
import { type NextRequest } from "next/server";
import { storage } from "@/lib/firebase";

export async function GET(req: NextRequest) {
  const list: BigVideoDataType[] = [];
  const videos = await prisma.videos.findMany();

  for (const video of videos) {
    const like = await prisma.likes.count({
      where: {
        videoId: video.id,
      },
    });

    const commentCount = await prisma.comment.count({
      where: {
        videoId: video.id
      }
    })



    const channel = await prisma.channels.findUnique({
      where: {
        id: video.channelId,
      },
    });

    const comment = await prisma.comment.findMany({
      where: {
        videoId: video.id,
      },
    });


    if (channel && comment) {
      const avatarRef = ref(storage, `/channel/avatars/${channel.tagName}`)
      const videoThumbnailRef = ref(storage, `/video/thumbnails/${video.link}`)
      const [videoThumbnail, avatarImage] = await Promise.all([getDownloadURL(videoThumbnailRef), getDownloadURL(avatarRef)])
      const channelData: ChannelDataType = { sub: 0, avatarImage, bannerImage: '', ...channel };
      const commentData: CommentDataType[] = comment;

      const videoData: VideoDataType = { like, thumbnail: videoThumbnail, comment: commentCount, ...video };
      const t: BigVideoDataType = {
        videoData,
        channelData,
        commentData,
      };

      list.push(t);
    }
  }

  return new Response(JSON.stringify(list), { status: 200 });
}