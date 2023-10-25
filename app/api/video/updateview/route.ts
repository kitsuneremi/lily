import prisma from '@/lib/prisma'
export async function POST(request: Request) {
    const body = await request.json();
    if (body.videoId) {
        const video = await prisma.videos.update({
            where: {
                id: body.videoId
            },
            data: {
                view: {
                    increment: 1
                }
            }
        })
        return new Response(JSON.stringify(video), { status: 200 })
    }

}