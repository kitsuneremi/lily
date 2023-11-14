import prisma from "@/lib/prisma";
import connect from '@/lib/mongodb'
import Likes from "@/model/liveChats";

interface RequestBody {
    accountId: number;
    targetId: number;
    type: number
}

export async function POST(request: Request) {
    const data: RequestBody = await request.json();

    if(!data){
        return new Response(null, { status: 400 })
    }
    // const findm = await Likes.findOne({
    //     $where: () => {
    //         return 
    //     }
    // })
    const find = await prisma.likes.findFirst({
        where: {
            accountId: data.accountId,
            mediaId: data.targetId
        }
    });

    if (find) {
        await prisma.likes.delete({
            where: {
                id: find.id
            }
        })

        return new Response(null, { status: 200 })
    } else {
        const like = await prisma.likes.create({
            data: {
                accountId: data.accountId,
                mediaId: data.targetId,
                type: data.type
            }
        })

        return new Response(JSON.stringify(like), { status: 201 })
    }

}