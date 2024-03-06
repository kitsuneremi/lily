import prisma from "@/lib/prisma";
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
                
                const channel = await prisma.account.findUnique({
                    where: {
                        id: target.accountId
                    }
                });
                return channel;
            });

            // Đợi cho tất cả các promises hoàn thành
            const channels = await Promise.all(channelPromises);

            // channels là một danh sách các thông tin kênh tương ứng
            return new NextResponse(JSON.stringify(channels), { status: 200 });
        } else {
            return new NextResponse(JSON.stringify(null), { status: 200 });
        }
    } else {
        return new NextResponse(JSON.stringify(null), { status: 400 });
    }
}
