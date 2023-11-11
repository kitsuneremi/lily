'use client'
import { ChannelDataType, VideoWithoutComment, MediaDataType } from '@/types/type'
import { useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';
import axios from 'axios';
import VideoItem from "@/components/own/watch/VideoItem";
import ThisChannelVideoItem from "@/components/own/watch/ThisChannelVideoItem";
import { Skeleton } from "@/components/ui/skeleton";

export default function VideoSuggest({
    videoId,
    channelData,
}: {
    videoId: number;
    channelData: ChannelDataType;
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
    const [allVideo, setAllVideo] = useState<VideoWithoutComment[]>();
    const [thisChannelVideo, setThisChannelVideo] = useState<MediaDataType[]>();

    useEffectOnce(() => {
        const allVideoFetch = axios
            .get("/api/video/channel/except", {
                params: {
                    videoId: videoId,
                    channelId: channelData.id,
                },
            })
            .then((res) => {
                setThisChannelVideo(res.data);
            });

        const thisChannelVideoFetch = axios
            .get("/api/video/all/except", {
                params: {
                    videoId: videoId,
                },
            })
            .then((res) => {
                setAllVideo(res.data);
            });

        Promise.all([allVideoFetch, thisChannelVideoFetch])
    });


    const RenderAllVideo = () => {
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
                    <RenderAllVideo />
                </div>
                <div className={`${tab == 1 ? '' : 'hidden'} flex flex-col gap-3 pt-2 overflow-y-scroll hidden-scrollbar pr-3`}>
                    {thisChannelVideo?.map((video, index) => {
                        return (
                            <ThisChannelVideoItem
                                key={index}
                                videoData={video}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
