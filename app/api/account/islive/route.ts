import { storage } from "@/lib/firebase";
import prisma from "@/lib/prisma";
import { getDownloadURL, ref } from "firebase/storage";
import { NextResponse, type NextRequest } from "next/server";
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');
    if (accountId) {
        const channel = await prisma.account.findUnique({
            where: {
                id: Number.parseInt(accountId)
            }
        })
        if (channel) {
            return new Response(JSON.stringify(channel.live), { status: 200 })
        } else {
            return new Response(JSON.stringify(null), { status: 404 })
        }
    }
}
