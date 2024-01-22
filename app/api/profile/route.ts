import { storage } from "@/lib/firebase";
import prisma from "@/lib/prisma"
import { getDownloadURL, ref } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {

    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    if (id) {
        const account = await prisma.accounts.findUnique({
            where: {
                id: Number.parseInt(id)
            }
        })


        if (account) {
            const { password, streamKey, username, ...user } = account
            const imageRef = ref(storage, `account/avatars/${account.id}`)
            const image = await getDownloadURL(imageRef)

            return new NextResponse(JSON.stringify({ avatarImage: image, ...user }), { status: 201 })
        } else {
            return new NextResponse(JSON.stringify({
                message: 'cannot find user'
            }), { status: 404 })
        }

    } else {
        return new NextResponse(JSON.stringify({
            message: 'error'
        }), {
            status: 403
        })
    }
}