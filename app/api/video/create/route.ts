import prisma from "@/lib/prisma";

interface RequestBody {
    title: string;
    des: string;
    link: string;
    channelId: number;
}

export async function POST(req: Request, res: Response) {
    const body: RequestBody = await req.json();
    const user = await prisma.videos.create({
        data: {
            title: body.title,
            des: body.des,
            view: 0,
            link: body.link,
            channelId: body.channelId,
            status: 0
        }
    });
    return new Response(JSON.stringify(user))
}