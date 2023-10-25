import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');
    const tagName = searchParams.get('tagName');
    if (accountId) {
        const channel = await prisma.channels.findUnique({
            where: {
                accountId: Number.parseInt(accountId)
            }
        })

        if (channel) {
            const sub = await prisma.subcribes.count({
                where: {
                    channelId: channel.id
                }
            })

            return new NextResponse(JSON.stringify({ sub, ...channel }), { status: 200 })
        } else {
            return new NextResponse(JSON.stringify({ message: 'cannot find channel' }), { status: 404 })
        }
    } else if (tagName) {
        const channel = await prisma.channels.findUnique({
            where: {
                tagName: tagName
            }
        })

        if (channel) {

            const sub = await prisma.subcribes.count({
                where: {
                    channelId: channel.id
                }
            })
            return new NextResponse(JSON.stringify({ sub, ...channel }), { status: 200 })
        } else {
            return new NextResponse(JSON.stringify({}), { status: 404 })
        }
    } else {
        return new NextResponse(JSON.stringify({ message: '???' }), { status: 403 })
    }
}