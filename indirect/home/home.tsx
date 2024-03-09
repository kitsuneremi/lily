'use client'
import VideoItem from "@/components/own/home/VideoItem";

export default function DirectHomePage({
    listVideo,
}) {
    const VideoItemRender = () => {
        if (listVideo) {
            return listVideo.map((item, index) => {
                return (
                    <VideoItem
                        videoData={item.videoData}
                        channelData={item.channelData}
                        key={index}
                    />
                );
            })
        };
    };

    return (
        <div className="h-[calc(100vh-64px)] flex-1 overflow-y-scroll max-[640px]:justify-items-center grid-flow-row grid max-[640px]:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 min-[2000px]:grid-cols-6 gap-4 px-2 lg:px-3">
            {VideoItemRender()}
        </div>
    );
}
