import prisma from "@/lib/prisma";

interface RequestBody {
    id: number;
    name: string;
    des: string;
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json();
    const video = await prisma.media.findFirst({
        where: {
            id: body.id,
        }
    })
    if (video != null) {
        const updatedMedia = await prisma.media.update({
            where: {
                id: body.id
            },
            data: {
                title: body.name,
                des: body.des
            }
        })

        if (updatedMedia != null) {
            return new Response(JSON.stringify(updatedMedia), { status: 200 })
        } else {
            return new Response(JSON.stringify(null), { status: 400 })
        }
    } else {
        return new Response(JSON.stringify(null), { status: 404 })
    }

}