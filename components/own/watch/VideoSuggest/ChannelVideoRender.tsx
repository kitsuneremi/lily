import ThisChannelVideoItem from "@/components/own/watch/ThisChannelVideoItem";
import { Media } from "@/prisma/type";
export default  function ChannelVideoRender({ thisChannelVideo }: { thisChannelVideo: Media[] }) {
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