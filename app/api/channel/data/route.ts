import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');
    console.log(accountId)
    if(accountId){
        const channel = await prisma.channels.findUnique({
            where: {
                accountId: Number.parseInt(accountId)
            }
        })
        if(channel){
            return new NextResponse(JSON.stringify(channel), {status: 200})
        }else{
            return new NextResponse(JSON.stringify({message: 'cannot find channel'}), {status: 404})
        }
    }else{
        return new NextResponse(JSON.stringify({message: '???'}), {status: 403})
    }
}