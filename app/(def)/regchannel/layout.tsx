import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: 'register page',
    description: 'register page'
}


const hadChannelFetch = async () => {
    const session = await getServerSession(authOptions);
    if(session){
        const channel = await prisma.channels.findFirst({
            where: {
                accountId: session.user.id
            }
        })
        return channel;
    }else{
        redirect('/register')
    }
}

export default async function Layout({ children }: { children: React.ReactElement }) {
    const data = await hadChannelFetch();
    if(data){
        return redirect(`/channel/${data.tagName}`)
    }else{
        return (
            <>{children}</>
        )
    }

}