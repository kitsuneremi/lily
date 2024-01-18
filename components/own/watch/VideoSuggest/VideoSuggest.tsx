'use client'
import { ChannelDataType, VideoWithoutComment, MediaDataType } from '@/types/type'
import { useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';
import axios from 'axios';
import VideoItem from "@/components/own/watch/VideoItem";
import ThisChannelVideoItem from "@/components/own/watch/ThisChannelVideoItem";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from 'next/dynamic';
import AllVideoRender from '@/components/own/watch/VideoSuggest/AllVideoRender'
import ChannelVideoRender from '@/components/own/watch/VideoSuggest/ChannelVideoRender'
// const AllVideoRender = dynamic(() => import('@/components/own/watch/VideoSuggest/AllVideoRender'))
// const ChannelVideoRender = dynamic(() => import('@/components/own/watch/VideoSuggest/ChannelVideoRender'))

export default function VideoSuggest({
    otherVideo,
    otherVideoInChannel,
    channelData
}: {
    otherVideo: VideoWithoutComment[];
    otherVideoInChannel: MediaDataType[];
    channelData: ChannelDataType
}) {
    const [tab, setTab] = useState<number>(0);

    const listItem = [
        {
            id: 0,
            name: "Tất cả",
        },
        {
            id: 1,
            name: `Của ${channelData.name}`,
        },
    ];

    return (
        <div className="flex flex-col w-full">
            <div className="flex gap-3">
                {listItem.map((button, index) => {
                    return (
                        <div
                            key={index}
                            onClick={() => {
                                setTab(button.id);
                            }}
                            className={`px-3 py-2 cursor-pointer rounded-xl bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-700 ${tab === button.id
                                ? "shadow-[0_0_20px_purple_inset]"
                                : ""
                                }`}
                        >
                            {button.name}
                        </div>
                    );
                })}
            </div>
            <div className="">
                <div className={`${tab == 0 ? '' : 'hidden'} flex flex-col gap-3 pt-2 overflow-y-scroll hidden-scrollbar pr-3`}>
                    <AllVideoRender allVideo={otherVideo} />
                </div>
                <div className={`${tab == 1 ? '' : 'hidden'} flex flex-col gap-3 pt-2 overflow-y-scroll hidden-scrollbar pr-3`}>
                    <ChannelVideoRender thisChannelVideo={otherVideoInChannel} />
                </div>
            </div>
        </div>
    );
};
