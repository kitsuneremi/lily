import prisma from "@/lib/prisma";

interface RequestBody {
    accountId: number;
    targetId: number;
    type: number
}

export async function POST(request: Request) {
    const data: RequestBody = await request.json();
    const x = await prisma.likes.findFirst({
        where: {
            accountId: data.accountId,
            videoId: data.targetId
        }
    })
    var like = null;
    if (x == null) {
        like = await prisma.likes.create(
            {
                data: {
                    accountId: data.accountId,
                    videoId: data.targetId,
                    type: data.type
                }
            }
        )
    } else {
        like = await prisma.likes.update({
            where: {
                videoId_accountId: {
                    accountId: data.accountId,
                    videoId: data.targetId,
                }
            },
            data: {
                type: data.type
            }
        })
    }
    const count = await prisma.likes.count({
        where: {
            type: 0
        }
    })
    const likewithcount = {...like, count: count}
    return new Response(JSON.stringify(likewithcount))
}