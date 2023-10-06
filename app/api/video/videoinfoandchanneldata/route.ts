import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const url = new URL(request.url)
    const params = {
        link: url.searchParams.get("link")
    }
    const video = await prisma.videos.findFirst({
        where: {
            link: params.link
        }
    })
    const comment = await prisma.comment.count({
        where: {
            videoId: video.id
        }
    })

    const channel = await prisma.channels.findFirst({
        where: {
            id: video.channelId
        }
    })
    const sub = await prisma.subcribes.count({
        where: {
            channelId: channel.id
        }
    })
    const channelx = { ...channel, sub: sub }
    const videox = { ...video, comment: comment }

    return new Response(JSON.stringify({ channelx, videox }))
}