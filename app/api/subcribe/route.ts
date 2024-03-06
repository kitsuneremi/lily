import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const searchParams = req.nextUrl.searchParams;
    const accountId = searchParams.get("accountId");
    const targetAccount = searchParams.get("targetChannel");

    if (accountId && targetAccount) {
        const subcribe = await prisma.subcribes.findUnique({
            where: {
                accountId: Number.parseInt(targetAccount), 
            }
        })

        if(subcribe){
            const detailSubcribe = await prisma.detailSubcribe.findFirst({
                where: {
                    subcribeId:  subcribe.id,
                    subcribedAccountId: Number.parseInt(accountId)
                }
            })

            return new NextResponse(JSON.stringify(detailSubcribe), { status: 200 })
        }
        return new NextResponse(JSON.stringify(null), { status: 404 })
    }else{
        return new NextResponse(JSON.stringify({message: "accountId or targetChannel is not found"}), { status: 400 })
    }
}