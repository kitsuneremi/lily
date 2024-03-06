import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

interface RequestBody {
    currentId: number,
    targetId: number,
}

export async function POST(req: NextRequest) {
    const body: RequestBody = await req.json()
    if (body.currentId && body.targetId) {
        const find = await prisma.subcribes.findUnique({
            where: {
                accountId: body.targetId
            }
        })

        if (find) {
            const sub = await prisma.detailSubcribe.findFirst({
                where: {
                    subcribedAccountId: body.currentId,
                    subcribeId: find.id
                }
            })

            if (sub) {
                prisma.detailSubcribe.delete({
                    where: {
                        id: sub.id
                    }
                }).then(res => {
                    return new Response(JSON.stringify({ message: 'unsub complete' }))
                })
            } else {
                const newSubcribeDetail = await prisma.detailSubcribe.create({
                    data: {
                        subcribeId: find.id,
                        subcribedAccountId: body.currentId
                    }
                })

                return new Response(JSON.stringify(newSubcribeDetail))
            }
        } else {
            const newSubcribe = await prisma.subcribes.create({
                data: {
                    accountId: body.targetId,
                }
            })

            if (newSubcribe) {
                const newSubcribeDetail = await prisma.detailSubcribe.create({
                    data: {
                        subcribeId: newSubcribe.id,
                        subcribedAccountId: body.currentId
                    }
                })

                return new Response(JSON.stringify(newSubcribeDetail))
            }

            return new Response(JSON.stringify({ message: 'an error unexpected happen' }))
        }
    }
}