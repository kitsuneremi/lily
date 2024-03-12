import Home from '@/components/own/channel/home'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Metadata } from "next"
import { Account } from '@/prisma/type'

const fetchData = async ({ tagName }: { tagName: string }) => {
    const channel = await prisma.account.findUnique({
        where: {
            tagName: tagName
        },
        // include: {
        //     Subcribes: true
        // }
    })


    if (channel) {
        return channel as Account;
    } else {
        redirect('/channel/not-found')
    }
}

export const metadata: Metadata = {
    title: 'video tab',
    description: 'video tab'
}

export default async function Page({ params }: { params: { tagName: string } }) {
    const channelData = await fetchData({ tagName: params.tagName })
    if(!channelData){
        redirect('/channel/not-found')
    }

    return (
        <Home channelData={channelData} />
    )
}