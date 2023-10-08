import VideoItem from '@/components/own/home/VideoItem';
import { VideoDataType, ChannelDataType } from '@/type/type';

export default function ({ listVideo }: { listVideo: { videoData: VideoDataType, channelData: ChannelDataType }[] }) {

    const VideoItemRender = () => {
        return listVideo.map((item, index) => {
            return (
                <VideoItem videoData={item.videoData} channelData={item.channelData} key={index} />
            )
        })
    }

    return (
        <div className='h-[calc(100vh-64px)] flex-1 overflow-y-scroll grid-rows-none grid max-[640px]:grid-cols-1 max-[640px]:justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 min-[2000px]:grid-cols-6 gap-8 lg:pr-3'>
            {VideoItemRender()}
        </div>
    )
}


