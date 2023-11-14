import { NextRequest, NextResponse } from "next/server";
import connect from '@/lib/mongodb'
import Likes from "@/model/liveChats";

export async function GET(req: NextRequest, res: NextResponse) {
    await connect();

    const likes = await Likes.find({})

    return new NextResponse(JSON.stringify(likes))
}