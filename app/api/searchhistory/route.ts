import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const keyword = searchParams.get('keyword')


    if (keyword != null && userId != null && Number.parseInt(userId)) {
        const data = await prisma.searchHistory.findMany({
            where: {
                content: {
                    contains: keyword
                },
                accountId: {
                    equals: Number.parseInt(userId)
                }
            },
            take: 5
        })
        return new Response(JSON.stringify(data))
    }
}