import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
type RequestBody = {
    accountId: number,
    name: string,
    tagName: string,
    des: string
}

export async function POST(req: NextRequest) {
    const body:RequestBody = await req.json()
    if(body){
        const findChannel = await prisma.channels.findUnique({
            where: {
                accountId: body.accountId
            }
        })
        if(!findChannel){
            const newChannel = await prisma.channels.create({
                data: {
                    accountId: body.accountId,
                    name: body.name,
                    tagName: body.tagName,
                    des: body.des,
                    streamKey: uuid(),
                }
            })
            return new NextResponse(JSON.stringify(newChannel), { status: 201 })
        }else{
            return new NextResponse(null, { status: 204 })
        }
    }else{
        return new NextResponse(null, { status: 400 })
    }
    
}