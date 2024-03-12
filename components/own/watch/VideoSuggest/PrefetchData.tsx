'use client'
import { baseURL } from '@/lib/functional';
import VideoSuggest from './VideoSuggest';
import { useEffectOnce } from 'usehooks-ts';
import { useState } from 'react'
import { Account } from '@/prisma/type';
export default function SuggestVideo({
    videoId,
    channelData,
}: {
    videoId: number;
    channelData: Account;
}) {
    const [otherVideoInChannel, setOtherVideoInChannel] = useState<any>();
    const [otherVideo, setOtherVideo] = useState<any>();

    useEffectOnce(() => {
        prefetchOtherVideoInChannel({ videoId: videoId, channelId: channelData.id }).then((data) => {
            setOtherVideoInChannel(data);
        });
    })

    useEffectOnce(() => {
        prefecthOtherVideo({ videoId: videoId }).then((data) => {
            setOtherVideo(data);
        })
    })

    // const [otherVideoInChannel, otherVideo] = await Promise.all([prefetchOtherVideoInChannel({ videoId: videoId, channelId: channelData.id }), prefecthOtherVideo({ videoId: videoId })]);
    if (otherVideo && otherVideoInChannel) {
        return <VideoSuggest channelData={channelData} otherVideo={otherVideo} otherVideoInChannel={otherVideoInChannel} />
    }else {
        return <></>
    }

}


const prefetchOtherVideoInChannel = async ({ videoId, channelId }: { videoId: number, channelId: number }) => {
    const dataPromise = fetch(`${baseURL}/api/video/channel/except?videoId=${videoId}&channelId=${channelId}`,
        {
            method: 'GET',
        }
    )
    return await (await dataPromise).json();
}

const prefecthOtherVideo = async ({ videoId }: { videoId: number }) => {
    const dataPromise = fetch(`${baseURL}/api/video/all/except?videoId=${videoId}`,
        {
            method: 'GET',
        }
    )
    return await (await dataPromise).json();
}