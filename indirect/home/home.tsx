import VideoItem from "@/components/own/home/VideoItem";
import { VideoDataType, ChannelDataType } from "@/types/type";

export default function ({
    listVideo,
}: {
    listVideo: { videoData: VideoDataType; channelData: ChannelDataType }[];
}) {
    const VideoItemRender = () => {
        return listVideo.map((item, index) => {
            return (
                <VideoItem
                    videoData={item.videoData}
                    channelData={item.channelData}
                    key={index}
                />
            );
        });
    };

    return (
        <div className="max-h-[calc(100vh-64px)] h-fit flex-1 overflow-y-scroll grid-flow-row  grid max-[640px]:grid-cols-1 max-[640px]:justify-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 min-[2000px]:grid-cols-6 gap-8 px-2 lg:px-3">
            {VideoItemRender()}
            {VideoItemRender()}
            {VideoItemRender()}
            {VideoItemRender()}
            {VideoItemRender()}
            {VideoItemRender()}
            {VideoItemRender()}
            {VideoItemRender()}
            {VideoItemRender()}
            {VideoItemRender()}
            {VideoItemRender()}
            {VideoItemRender()}
            {VideoItemRender()}
            {VideoItemRender()}
        </div>
    );
}
