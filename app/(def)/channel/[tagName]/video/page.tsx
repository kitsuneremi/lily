import { Metadata } from "next"
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import Videos from "@/components/own/channel/videos"
import { Account } from "@/prisma/type"

export const metadata: Metadata = {
    title: 'video tab',
    description: 'video tab'
}

const fetchData = async ({ tagName }: { tagName: string }) => {
    const channel = await prisma.account.findUnique({
        where: {
            tagName: tagName
        },
        include: {
            comment: true,
            Likes: true,
            Subcribes: true
        }
    })


    if (channel) {
        return channel as Account;
    } else {
        redirect('/channel/not-found')
    }
}

export default async function Page({ params }: { params: { tagName: string } }) {
    const channelData = await fetchData({ tagName: params.tagName })
    if(!channelData){
        redirect('/channel/not-found')
    }
    return (
        <div>
            <Videos channelData={channelData}/>
        </div>
    )
}