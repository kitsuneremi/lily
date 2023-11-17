import { storage } from "@/lib/firebase";
import prisma from "@/lib/prisma";
import { ChannelDataType, MediaDataType } from "@/types/type";
import { ref, getDownloadURL } from "firebase/storage";
import { NextRequest } from "next/server";

const channelQuery = async (keyword: string) => {
    const channels = await prisma.channels.findMany({
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

    const subPromise = channels.map(channel => {
        return prisma.subcribes.count({
            where: {
                channelId: channel.id
            }
        })
    }) 

    const imagePromise = channels.map(channel => {
        const avatarRef = ref(storage, `/channel/avatars/${channel.tagName}`)
        return getDownloadURL(avatarRef)
    })
    const subResult = await Promise.all(subPromise)
    const imageResult = await Promise.all((await Promise.resolve(imagePromise)))
    const newChannels: ChannelDataType[] = channels.map((channel, index) => {
        return {
            ...channel,
            live: channel.live ? channel.live : false,
            avatarImage: imageResult[index],
            sub: subResult[index]
        }
    })

    return newChannels
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

    const avatarPromise = videos.map(video => {
        const avatarRef = ref(storage, `/channel/avatars/${video.Channels.tagName}`);
        return getDownloadURL(avatarRef)
    })

    const videoThumbnailPromise = videos.map(video => {
        let videoThumbnailRef = null;
        if (video.mediaType == 1 || video.mediaType == 2) {
            videoThumbnailRef = ref(storage, `/channel/avatars/${video.Channels.tagName}`)
        } else {
            videoThumbnailRef = ref(storage, `/video/thumbnails/${video.link}`)
        }
        return getDownloadURL(videoThumbnailRef)
    })

    const videoThumbnail = await Promise.all(videoThumbnailPromise)
    const avatarImage = await Promise.all(avatarPromise)

    const videoData: MediaDataType[] = videos.map((video, index) => {
        return {
            ...video,
            Channels: {
                ...video.Channels,
                avatarImage: avatarImage[index]
            },
            thumbnail: videoThumbnail[index]
        }

    })

    return videoData
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