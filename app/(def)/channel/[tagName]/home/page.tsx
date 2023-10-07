import Home from '@/components/own/channel/home'
import prisma from '@/lib/prisma'
import { ChannelDataType } from '@/type/type'
import { redirect } from 'next/navigation'
import { Metadata } from "next"

const fetchData = async ({ tagName }: { tagName: string }) => {
    const channel = await prisma.channels.findUnique({
        where: {
            tagName: tagName
        }
    })


    if (channel) {
        const sub = await prisma.subcribes.count({
            where: {
                channelId: channel.id
            }
        })
        const channelData: ChannelDataType = { sub: sub, ...channel };
        return channelData;
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
    return (
        <Home channelData={channelData} />
    )
}