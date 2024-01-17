'use server'
import { MediaDataType, VideoWithoutComment } from "@/types/type";
import VideoItem from "@/components/own/watch/VideoItem";
import { Skeleton } from "@/components/ui/skeleton";

const RenderAllVideo = ({ allVideo }: { allVideo: VideoWithoutComment[] }) => {
    if (allVideo) {
        return allVideo.map((video, index) => {
            return <VideoItem key={index} videoData={video.videoData} channelData={{ live: false, ...video.channelData }} />;
        })
    } else {
        return <div className="flex flex-col items-center h-fit w-full p-3">
            <div className="relative w-full h-fit pt-[56.25%] rounded-md bg-transparent">
                <Skeleton className="absolute w-full h-full rounded-md" />
            </div>
            <div className="flex w-full gap-3 pt-1">
                <Skeleton className="w-[30px] h-[30px] rounded-full" />
                <div className="w-[calc(100%-30px)] flex flex-col">
                    <Skeleton className="w-full h-[20px] rounded-lg" />

                    <Skeleton className="w-12 h-[26px] rounded-lg" />
                    <Skeleton className="w-12 h-[18px] rounded-lg" />
                </div>
            </div>
        </div>
    }
}

export default RenderAllVideo