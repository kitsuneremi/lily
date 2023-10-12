import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){

    const searchParams = req.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');

    if(accountId){
        const data = await prisma.notifications.findMany()

        return new NextResponse(JSON.stringify(data), {status: 200})
    }
}