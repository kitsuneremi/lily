import { storage } from "@/lib/firebase";
import prisma from "@/lib/prisma";
import { getDownloadURL, ref } from "firebase/storage";
import { NextResponse, type NextRequest } from "next/server";
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');
    const tagName = searchParams.get('tagName');
    const channelId = searchParams.get('channelId');
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

            const bannerRef = ref(storage, `/channel/banners/${channel.tagName}`)
            const avatarRef = ref(storage, `/channel/avatars/${channel.tagName}`)
            const [bannerImage, avatarImage] = await Promise.all([getDownloadURL(bannerRef), getDownloadURL(avatarRef)])
            return new NextResponse(JSON.stringify({ sub, avatarImage, bannerImage, ...channel }), { status: 200 })
        } else {
            return new NextResponse(JSON.stringify(null), { status: 404 })
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

            const bannerRef = ref(storage, `/channel/banners/${channel.tagName}`)
            const avatarRef = ref(storage, `/channel/avatars/${channel.tagName}`)
            const [bannerImage, avatarImage] = await Promise.all([getDownloadURL(bannerRef), getDownloadURL(avatarRef)])
            return new NextResponse(JSON.stringify({ sub, avatarImage, bannerImage, ...channel }), { status: 200 })
        } else {
            return new NextResponse(JSON.stringify(null), { status: 404 })
        }
    } else if (channelId) {
        const channel = await prisma.channels.findUnique({
            where: {
                id: Number.parseInt(channelId)
            }
        })

        if (channel) {
            const sub = await prisma.subcribes.count({
                where: {
                    channelId: channel.id
                }
            })

            const bannerRef = ref(storage, `/channel/banners/${channel.tagName}`)
            const avatarRef = ref(storage, `/channel/avatars/${channel.tagName}`)
            const [bannerImage, avatarImage] = await Promise.all([getDownloadURL(bannerRef), getDownloadURL(avatarRef)])
            return new NextResponse(JSON.stringify({ sub, avatarImage, bannerImage, ...channel }), { status: 200 })
        } else {
            return new NextResponse(JSON.stringify(null), { status: 404 })
        }
    } else {
        return new NextResponse(JSON.stringify(null), { status: 403 })
    }
}
