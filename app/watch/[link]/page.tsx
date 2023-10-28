import { baseURL } from '@/lib/functional';
import type { Metadata, ResolvingMetadata } from 'next'
import { type VideoDataType, BigVideoDataType } from '@/type/type';
import Watch from '@/indirect/watch/watch'
type Props = {
    params: { link: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {

    const link = params.link;
    const data: BigVideoDataType = await fetchVideoData({ link: link });
    return {
        title: data.videoData.title,
        description: data.videoData.des
    }
}

const fetchVideoData = async ({ link }: { link: string }) => {
    'use server'
    const res = await fetch(`${baseURL}/api/video/data?link=${link}`, {
        method: 'GET',
        next: {
            revalidate: 5
        }
    })
    const data: BigVideoDataType = await res.json();
    return data;
}

export default async ({ params, searchParams }: Props) => {
    const data = await fetchVideoData({ link: params.link })
    return <Watch videoData={data}></Watch>
}