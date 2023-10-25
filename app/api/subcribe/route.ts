import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const searchParams = req.nextUrl.searchParams;
    const accountId = searchParams.get("accountId");
    const targetChannel = searchParams.get("targetChannel");

    if (accountId && targetChannel) {
        const subcribe = await prisma.subcribes.findUnique({
            where: {
                accountId_channelId: { accountId: Number.parseInt(accountId), channelId: Number.parseInt(targetChannel) }
            }
        })
        if (subcribe) {
            return new NextResponse(JSON.stringify(subcribe), { status: 200 })
        }else{
            return new NextResponse(JSON.stringify(null), { status: 404 })
        }
    }else{
        return new NextResponse(JSON.stringify({message: "accountId or targetChannel is not found"}), { status: 400 })
    }
}