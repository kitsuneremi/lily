import { NextRequest, NextResponse } from "next/server";
import connect from '@/lib/mongodb'
import liveChats from "@/model/liveChats";
export async function GET(req: NextRequest, res: NextResponse) {
    await connect();
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    if (id && Number.parseInt(id)) {
        const chats = await liveChats.find({
            room: id
        })

        return new NextResponse(JSON.stringify(chats))
    } else {
        return new NextResponse(null, { status: 400 })
    }
}