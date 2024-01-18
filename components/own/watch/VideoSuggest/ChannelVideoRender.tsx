import { MediaDataType, VideoWithoutComment } from "@/types/type";
import ThisChannelVideoItem from "@/components/own/watch/ThisChannelVideoItem";
export default  function ChannelVideoRender({ thisChannelVideo }: { thisChannelVideo: MediaDataType[] }) {
    return (
        <>
            {thisChannelVideo?.map((video, index) => {
                return (
                    <ThisChannelVideoItem
                        key={index}
                        videoData={video}
                    />
                );
            })}
        </>
    )
}