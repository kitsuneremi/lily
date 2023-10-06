import prisma from "@/lib/prisma";

interface RequestBody {
    id: number;
    name: string;
    des: string;
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json();
    const video = await prisma.videos.findFirst({
        where: {
            id: body.id,
        }
    })
    if (video != null) {
        const newvideo = await prisma.videos.update({
            where: {
                id: body.id
            },
            data: {
                title: body.name,
                des: body.des
            }
        })

        if (newvideo != null) {
            return new Response(JSON.stringify(newvideo), { status: 200 })
        } else {
            return new Response(JSON.stringify(null), { status: 400 })
        }
    } else {
        return new Response(JSON.stringify(null), { status: 404 })
    }

}