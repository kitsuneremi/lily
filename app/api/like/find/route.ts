import prisma from "@/lib/prisma";
import { verifyToken } from '@/lib/jwt'
export async function GET(request: Request) {
    const url = new URL(request.url);
    const params = {
        accountId: parseInt(url.searchParams.get("accountId") || ""),
        targetId: parseInt(url.searchParams.get("targetId") || "")
    };

    const token = request.headers.get("Authorization");
    if (token && verifyToken(token.split(" ")[1])) {
        const like = await prisma.likes.findFirst({
            where: {
                accountId: params.accountId,
                videoId: params.targetId
            }
        })
        const x = await prisma.likes.count({
            where: {
                type: 0
            }
        })
        const newlike = { ...like, count: x }
        return new Response(JSON.stringify(newlike), { status: 200 })
    }else{
        return new Response(JSON.stringify({message:"Unauthorized"}), { status: 401 })
    }

}