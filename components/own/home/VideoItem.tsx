"use client";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { FormatDateTime, ReduceString } from "@/lib/functional";
import { useCallback, useEffect, useState } from "react";
import { MediaDataType, ChannelDataType } from "@/types/type";

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
    videoData: MediaDataType;
    channelData: ChannelDataType;
}) {
    const genLink = useCallback(() => {
        if (videoData.mediaType == 1) {
            return `/stream/${channelData.tagName}`;
        } else {
            return `/watch/${videoData.link}`;
        }
    }, []);

    return (
        <Link href={genLink()} className="max-[640px]:max-w-[78vw] w-full">
            <div className="grid items-center h-fit">
                {videoData.mediaType == 0 ? (
                    <div className="relative w-full aspect-video rounded-md bg-transparent">
                        {videoData && videoData.thumbnail ? (
                            <Image
                                alt=""
                                className="rounded-md bg-transparent"
                                fill
                                sizes="16/9"
                                src={videoData.thumbnail}
                                loading="lazy"
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                ) : (
                    <div className="relative w-full aspect-video rounded-md bg-opacity-40 bg-slate-100 flex justify-center">
                        <div className="h-full aspect-square relative">
                            {videoData && videoData.thumbnail ? (
                                <Image
                                    alt=""
                                    className="rounded-md bg-transparent"
                                    fill
                                    sizes="1/1"
                                    src={videoData.thumbnail}
                                    loading="lazy"
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                        {(videoData.mediaType == 1 ||
                            videoData.mediaType == 2) && (
                            <div
                                className={`${
                                    videoData.mediaType == 1
                                        ? "bg-red-600"
                                        : "bg-slate-600"
                                } text-white px-1 py-[1px] absolute bottom-1 left-1 text-xs`}
                            >
                                Trực tiếp
                            </div>
                        )}
                    </div>
                )}
                <div className="flex w-full gap-3 pt-1">
                    <div className="w-[30px]">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Link
                                        href={`/channel/${channelData.tagName}`}
                                    >
                                        {channelData &&
                                        channelData.avatarImage ? (
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
                                            <p className="text-sm font-semibold hover:underline">
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
                            <p className="text-xs">
                                {" "}
                                {videoData.view}
                                {videoData.mediaType == 1
                                    ? " người đang xem"
                                    : " lượt xem"}
                            </p>
                            <p className="text-xs">
                                {videoData.mediaType == 0
                                    ? ""
                                    : videoData.mediaType == 1
                                    ? "Đã bắt đầu "
                                    : "Đã phát trực tiếp "}
                                {FormatDateTime(videoData.createdTime)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
