import { storage } from "@/lib/firebase";
import prisma from "@/lib/prisma";
import { Account, Media } from "@/types/type";
import { ref, getDownloadURL } from "firebase/storage";
import { NextRequest } from "next/server";

const channelQuery = async (keyword: string) => {
    const channels = await prisma.account.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: keyword
                    }
                },
                {
                    tagName: {
                        contains: keyword
                    }
                }
            ]
        }
    })
    return channels
}

const videosQuery = async (keyword: string) => {
    const videos = await prisma.media.findMany({
        where: {
            title: {
                contains: keyword
            }
        },
        include: {
            Channels: true
        }
    })

    return videos
}


export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const keyword = searchParams.get('keyword')


    if (keyword != null) {

        // test thử fetch data song song
        const [channels, videos] = await Promise.all([channelQuery(keyword), videosQuery(keyword)])

        return new Response(JSON.stringify({ channels: channels, videos: videos }))
    }
}