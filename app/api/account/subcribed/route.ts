import { storage } from "@/lib/firebase";
import prisma from "@/lib/prisma";
import { getDownloadURL, ref } from "firebase/storage";
import { NextApiRequest } from "next";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');

    if (accountId && Number.parseInt(accountId)) {
        const list = await prisma.subcribes.findMany({
            where: {
                accountId: Number.parseInt(accountId)
            }
        });

        if (list && list.length > 0) {
            // Sử dụng Promise.all để lặp qua danh sách và tìm thông tin kênh tương ứng
            const channelPromises = list.map(async (target) => {
                const channel = await prisma.channels.findUnique({
                    where: {
                        id: target.channelId
                    }
                });
                if (channel) {
                    const { id, accountId, des, createdAt, updatedAt, ...channelWithoutId } = channel

                    const imageRef = ref(storage, `/channel/avatars/${channel.tagName}`)
                    const image = await getDownloadURL(imageRef);
                    return { image: image, ...channelWithoutId };
                } else {
                    return null;
                }

            });

            // Đợi cho tất cả các promises hoàn thành
            const channels = await Promise.all(channelPromises);

            // channels là một danh sách các thông tin kênh tương ứng
            return new NextResponse(JSON.stringify(channels), { status: 200 });
        } else {
            return new NextResponse(JSON.stringify(null), { status: 400 });
        }
    } else {
        return new NextResponse(JSON.stringify(null), { status: 400 });
    }
}
