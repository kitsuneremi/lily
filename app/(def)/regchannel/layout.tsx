import prisma from "@/lib/prisma"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from '@/auth'
export const metadata: Metadata = {
    title: 'register page',
    description: 'register page'
}


const hadChannelFetch = async () => {
    const session = await auth();
    if (session) {
        const channel = await prisma.account.findFirst({
            where: {
                id: session.user.id
            }
        })
        return channel;
    } else {
        redirect('/register')
    }
}

export default async function Layout({ children }: { children: React.ReactElement }) {
    const data = await hadChannelFetch();
    if (data) {
        return redirect(`/channel/${data.tagName}`)
    } else {
        return (
            <>{children}</>
        )
    }

}