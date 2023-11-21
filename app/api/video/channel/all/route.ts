import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { MediaDataType } from "@/types/type";
export async function GET(req: NextRequest, res: NextResponse) {
    const searchParams = req.nextUrl.searchParams;
    const channelId = searchParams.get("channelId");

    let list:MediaDataType[] = [];

    if (channelId && Number.parseInt(channelId)) {
        const videos = await prisma.media.findMany({
            where: {
                channelId: Number.parseInt(channelId),
                AND:{
                    mediaType: 0,
                }
            },
            include:{
                Channels:true
            }
        })

        for (const video of videos) {

            const videoThumbnailRef = ref(storage, `/channel/avatars/${video.Channels.tagName}`)
            const videoThumbnail = await getDownloadURL(videoThumbnailRef)

            list.push({...video, thumbnail: videoThumbnail})
        }

        return new NextResponse(JSON.stringify(videos), { status: 200 });
    } else {
        return new NextResponse(JSON.stringify({ error: "channelId is required" }), { status: 400 });
    }
}