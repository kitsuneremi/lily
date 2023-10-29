import prisma from "@/lib/prisma";
import { VideoDataType, BigVideoDataType, ChannelDataType, CommentDataType } from "@/types/type";
import { type NextRequest } from "next/server";

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

    const videoData: VideoDataType = { like, comment: commentCount, ...video };

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
      const channelData: ChannelDataType = { sub: 0, ...channel };
      const commentData: CommentDataType[] = comment;
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