import prisma from "@/lib/prisma";
import { now } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {

    const body = await req.json();
    console.log(body)
    const channel = await prisma.account.findUnique({
        where: {
            id: body.accountId
        }
    })
    console.log(channel)
    if (channel && channel.live) {
        const newLive = await prisma.media.create({
            data: {
                accountId: channel.id,
                des: body.des,
                isLive: true,
                title: body.title,
                status: body.status,
                mediaType: 1,
                link: channel.tagName
            }
        })
        return new Response(JSON.stringify(newLive), { status: 201 })
    } else {
        return new Response(JSON.stringify({ message: "no stream" }))
    }
}