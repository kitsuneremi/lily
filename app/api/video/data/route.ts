import { storage } from "@/lib/firebase";
import prisma from "@/lib/prisma";
import { ref, getDownloadURL } from "firebase/storage";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const link = searchParams.get('link');

    console.log(link)

    if (link) {

        const mediaList = await prisma.media.findMany({
            include: {
                _count: true,
                Likes: true,
                Account: true,
                Comment: true,
            }
        });

        // Lặp qua danh sách media để tính số lượng like và subscribe
        const mediaWithStats = mediaList.map(media => {
            const likeCount = media.Likes.length;
            const subscribeCount = media.Account ? 1 : 0; // Đây là ví dụ đơn giản, bạn có thể tính theo cách phức tạp hơn

            return {
                ...media,
                likeCount,
                subscribeCount
            };
        });
        return new NextResponse(JSON.stringify(mediaWithStats))
    } else {
        return new NextResponse(JSON.stringify({ message: 'invalid video link' }), { status: 404 })
    }

}