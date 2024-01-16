import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


interface RequestBody {
    accountId: number;
    name: string;
    targetId: number;
}


export async function GET(req: NextRequest, res: NextResponse) {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    if (id && Number.parseInt(id)) {
        const room = await prisma.room.findMany({
            where: {
                id: Number.parseInt(id)
            },
            include: {
                Member: {
                    select: {
                        id: true,
                        roomId: true,
                        accountId: true,
                        name: true
                    }
                }
            }
        })
        return new NextResponse(JSON.stringify(room))
    } else {
        return new NextResponse(null, { status: 400 })
    }
}


export async function POST(req: Request) {
    const body: RequestBody = await req.json();
    const existingRoom = await prisma.room.findFirst({
        where: {
            Member: {
                every: {
                    OR: [
                        { accountId: body.accountId },
                        { accountId: body.targetId }
                    ]
                }
            }
        }
    });
    //check any room between current account and target account before
    if (existingRoom != null) {
        return new Response(JSON.stringify(existingRoom))
    } else {
        // create one if no room between current account and target account exists yet
        const target = await prisma.accounts.findFirst({
            where: {
                id: body.targetId
            }
        })
        if (target != null) {
            const room = await prisma.room.create({
                data: {
                    name: 'new chat'
                }
            })
            const selfMember = await prisma.member.create({
                data: {
                    name: body.name,
                    roomId: room.id,
                    accountId: body.accountId
                }
            })

            const targetMember = await prisma.member.create({
                data: {
                    name: target.name,
                    accountId: target.id,
                    roomId: room.id
                }
            })
            return new Response(JSON.stringify(room))
        }
    }
}