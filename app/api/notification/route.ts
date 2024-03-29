import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){

    const searchParams = req.nextUrl.searchParams;
    const accountId = searchParams.get('accountid');

    if(accountId){
        const data = await prisma.notificationDetail.findMany({
            where: {
                targetAccountId: Number.parseInt(accountId)
            }
        })

        return new NextResponse(JSON.stringify(data), {status: 200})
    }else{
        return new NextResponse(JSON.stringify({message: 'No account id provided'}), {status: 400})
    }
}