import prisma from "@/lib/prisma";
import { type NextRequest } from "next/server";


export async function GET(req: NextRequest) {

  const videos = await prisma.media.findMany({
    include: {
      _count: true,
      Likes: true,
      Account: true,
      Comment: true,
    }
  });

  return new Response(JSON.stringify(videos), { status: 200 });
}