import { Metadata } from "next"
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ChannelDataType } from '@/type/type'
import Videos from "@/components/own/channel/videos"

export const metadata: Metadata = {
    title: 'video tab',
    description: 'video tab'
}

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