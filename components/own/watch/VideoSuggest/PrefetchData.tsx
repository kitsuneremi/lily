'use server';
import { ChannelDataType, VideoWithoutComment, MediaDataType } from '@/types/type'
import { baseURL } from '@/lib/functional';
import VideoSuggest from './VideoSuggest';
export default async function SuggestVideo({
    videoId,
    channelData,
}: {
    videoId: number;
    channelData: ChannelDataType;
}) {
    const [otherVideoInChannel, otherVideo] = await Promise.all([prefetchOtherVideoInChannel({ videoId: videoId, channelId: channelData.id }), prefecthOtherVideo({ videoId: videoId })]);

    return <VideoSuggest channelData={channelData} otherVideo={otherVideo} otherVideoInChannel={otherVideoInChannel} />
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
            method: 'GET'
        }
    )
    return await (await dataPromise).json();
}