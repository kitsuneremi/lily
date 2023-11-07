import prisma from "@/lib/prisma";
import { now } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {

    const body = await req.json();
    console.log(body)
    const channel = await prisma.channels.findUnique({
        where: {
            accountId: body.accountId
        }
    })
    console.log(channel)
    if (channel && channel.live) {
        const updateLive = await prisma.media.update({
            where: {
                id: body.id
            },
            data: {
                des: body.des,
                title: body.title,
                status: body.status,
            }
        })
        return new Response(JSON.stringify(updateLive), { status: 200 })
    } else {
        return new Response(JSON.stringify({ message: "no stream" }))
    }
}