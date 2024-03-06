import prisma from "@/lib/prisma";
import { getDownloadURL, ref } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/firebase";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const channelId = searchParams.get('channelId');

  if (channelId) {
    const videos = await prisma.media.findMany({
      where: {
        accountId: Number.parseInt(channelId)
      },
      include: {
        _count: true,
        Likes: true,
        Account: true,
        Comment: true,
      },
      orderBy: {
        view: 'desc'
      },
      take: 10
    })
    return new NextResponse(JSON.stringify(videos))
  } else {
    return new NextResponse(JSON.stringify({ message: '???' }), { status: 403 })
  }
} 