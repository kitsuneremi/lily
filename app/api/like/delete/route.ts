import prisma from "@/lib/prisma";

interface RequestBody {
    accountId: number;
    targetId: number;
    type: number
}
export async function POST(request: Request) {
    const data: RequestBody = await request.json();
    const like = await prisma.likes.deleteMany(
        {
            where: {
                accountId: data.accountId,
                AND: {
                    mediaId: data.targetId
                }

            }
        }
    )
    const count = await prisma.likes.count({
        where: {
            type: 0
        }
    })
    const likewithcount = { ...like, count: count }
    return new Response(JSON.stringify(likewithcount))
}