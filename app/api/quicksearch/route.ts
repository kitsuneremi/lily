import prisma from "@/lib/prisma";
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
        },
        select: {
            name: true,
        }
    })
    return channels;
}

const videosQuery = async (keyword: string) => {
    const videos = await prisma.media.findMany({
        where: {
            title: {
                contains: keyword
            }
        },
        select:{
            title: true,
            link:true
        }
    })

    return videos
}


export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const keyword = searchParams.get('keyword')


    if (keyword != null) {

        // test thử fetch data song song
        // const [channels, videos] = await Promise.all([channelQuery(keyword), videosQuery(keyword)])
        const videos = await videosQuery(keyword)

        return new Response(JSON.stringify(videos))
    }
}