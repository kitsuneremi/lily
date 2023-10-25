import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RequestBody = {
    accountId: number,
    channelId: number,
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json();
    const { accountId, channelId } = body
    if (accountId && channelId) {

        const find = await prisma.subcribes.findUnique({
            where: {
                accountId_channelId: {
                    accountId: accountId,
                    channelId: channelId
                }
            }
        })

        if (find) {
            await prisma.subcribes.delete({
                where: {
                    accountId_channelId: {
                        accountId: accountId,
                        channelId: channelId
                    }
                }
            })
            return new NextResponse(JSON.stringify(null), { status: 200 })
        } else {
            const subcribe = await prisma.subcribes.create({
                data: {
                    accountId: accountId,
                    channelId: channelId
                }
            })
            return new NextResponse(JSON.stringify(subcribe), { status: 200 })
        }
    } else {
        return new NextResponse(JSON.stringify({ message: "accountId or channelId is not found" }), { status: 400 })
    }
}