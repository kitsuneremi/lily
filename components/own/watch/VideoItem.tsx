"use client";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { FormatDateTime, ReduceString } from "@/lib/functional";
import { useEffect, useState } from "react";
import { VideoDataType, ChannelDataType } from "@/types/type";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";

// const fetchImg = async ({ videoLink, channelTagname }: { videoLink: string, channelTagname: string }) => {
//     'use server'
//     const videoImageStorageRef = ref(storage, `/video/thumbnails/${videoLink}`)
//     const channelAvatarStorageRef = ref(storage, `/channel/avatars/${channelTagname}`)
//     const img = await getDownloadURL(videoImageStorageRef)
//     const channelAvatar = await getDownloadURL(channelAvatarStorageRef)

//     return { img, channelAvatar }
// }

export default function VideoItem({ videoData }: { videoData: VideoDataType }) {
    const [img, setImg] = useState<string>();
    const [channelData, setChannelData] = useState<ChannelDataType>();

    useEffect(() => {
        axios
            .get(`/api/channel/data`, {
                params: {
                    channelId: videoData.channelId,
                },
            })
            .then((res) => {
                setChannelData(res.data);
            });
    }, []);

    useEffect(() => {
        if (channelData) {
            const videoImageStorageRef = ref(
                storage,
                `/video/thumbnails/${videoData.link}`
            );
            getDownloadURL(videoImageStorageRef).then((url) => setImg(url));
        }
    }, [channelData]);

    // const {img, channelAvatar} = Promise.all([fetchImg])

    return (
        <Link
            href={`/watch/${videoData.link}`}
            className="max-[640px]:max-w-[78vw] w-full"
        >
            <div className="flex gap-3 w-full items-center">
                <div className="relative flex-0 w-[40%] pt-[25%] h-fit rounded-md bg-transparent">
                    {img ? (
                        <Image
                            alt=""
                            className="rounded-md bg-transparent"
                            fill
                            src={img}
                            priority={true}
                            sizes="16/9"
                        />
                    ) : (
                        <></>
                    )}
                </div>
                <div className="flex w-full flex-1 flex-col">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <p className="text-lg font-bold w-full text-start overflow-hidden">
                                    {ReduceString({
                                        string: videoData.title,
                                        maxLength: 30,
                                    })}
                                </p>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{videoData.title}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Link
                                        href={`/channel/${channelData?.tagName}`}
                                    >
                                        <p className="text-md font-semibold hover:underline">
                                            {channelData?.name}
                                        </p>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Chuyển tới kênh {channelData?.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div>
                        <p className="text-sm">{videoData.view} lượt xem</p>
                        <p className="text-sm">
                            {FormatDateTime(videoData.createdAt)}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
