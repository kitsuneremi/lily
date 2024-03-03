import { baseURL } from '@/lib/functional';
import type { Metadata, ResolvingMetadata } from 'next'
import { type MediaDataType, BigVideoDataType, LiveData, ChannelDataType } from '@/types/type';
import Watch from '@/indirect/watch/watch'
import { redirect } from 'next/navigation'
import StreamPage from '@/indirect/stream/stream'
type Props = {
    params: { tag: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    // const data: LiveData = await fetchVideoData({ tag: params.tag });
    const channelData: ChannelDataType = await fetchChannelData({ tagName: params.tag });
    return {
        title: `buổi phát trực tiếp của ${channelData.name}`,
        description: `buổi phát trực tiếp của ${channelData.name}`
    }
}

const fetchVideoData = async ({ tag }: { tag: string }) => {
    'use server'
    const res = await fetch(`${baseURL}/api/live/data?tag=${tag}`, {
        method: 'GET',
        next: {
            revalidate: 5
        }
    })
    if (res.status == 400) {
        return redirect(`/stream/not-found`)
    } else if (res.status == 404) {
        return redirect(`/stream/${tag}/no-stream`)
    } else {
        const data: MediaDataType = await res.json();
        if (data.mediaType == 2) {
            return redirect(`/watch/${data.link}`)
        }
        return data;
    }
}

const fetchChannelData = async ({ tagName }: { tagName: string }) => {
    const res = await fetch(`${baseURL}/api/channel/data?tagName=${tagName}`, {
        method: 'GET',
    })

    const data: ChannelDataType = await res.json();
    return data;
}

export default async ({ params, searchParams }: Props) => {
    const data: MediaDataType = await fetchVideoData({ tag: params.tag })
    const channelData: ChannelDataType = await fetchChannelData({ tagName: params.tag });
    return (
        <StreamPage streamData={data} channelData={channelData} />
    )
} 