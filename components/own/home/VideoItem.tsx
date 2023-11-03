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

// const fetchImg = async ({ videoLink, channelTagname }: { videoLink: string, channelTagname: string }) => {
//     'use server'
//     const videoImageStorageRef = ref(storage, `/video/thumbnails/${videoLink}`)
//     const channelAvatarStorageRef = ref(storage, `/channel/avatars/${channelTagname}`)
//     const img = await getDownloadURL(videoImageStorageRef)
//     const channelAvatar = await getDownloadURL(channelAvatarStorageRef)

//     return { img, channelAvatar }
// }

export default function VideoItem({
    videoData,
    channelData,
}: {
    videoData: VideoDataType;
    channelData: ChannelDataType;
}) {

    return (
        <Link
            href={`/watch/${videoData.link}`}
            className="max-[640px]:max-w-[78vw] w-full"
        >
            <div className="grid items-center h-fit">
                <div className="relative w-full h-fit min-h-[120px] pt-[56.25%] rounded-md bg-transparent">
                    {videoData ? (
                        <Image
                            alt=""
                            className="rounded-md bg-transparent"
                            fill
                            src={videoData.thumbnail}
                            priority={true}
                        />
                    ) : (
                        <></>
                    )}
                </div>
                <div className="flex w-full gap-3 pt-1">
                    <div className="w-[30px]">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Link
                                        href={`/channel/${channelData.tagName}`}
                                    >
                                        {channelData ? (
                                            <Image
                                                className="rounded-full bg-transparent"
                                                alt="img"
                                                width={30}
                                                height={30}
                                                loading="lazy"
                                                src={channelData.avatarImage}
                                            />
                                        ) : (
                                            <></>
                                        )}
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Chuyển tới kênh {channelData.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="w-[calc(100%-30px)] flex flex-col">
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
                                            href={`/channel/${channelData.tagName}`}
                                        >
                                            <p className="text-md font-semibold hover:underline">
                                                {channelData.name}
                                            </p>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            Chuyển tới kênh {channelData.name}
                                        </p>
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
            </div>
        </Link>
    );
}
