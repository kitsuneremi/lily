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
import { motion } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";
import QuickPlayer from './QuickPlayer'

const borderVariants = {
    start: { borderColor: 'red' },
    toYellow: { borderColor: 'yellow' },
    toGreen: { borderColor: 'green' },
    toBlue: { borderColor: 'blue' },
    end: { borderColor: 'red' },
};

const borderTransition = {
    duration: 5,
    repeat: Infinity,
};

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

    const [hover, setHover] = useState<boolean>(false);

    const mouseEnter = () => {
        setTimeout(() => {
            if(!hover){
                setHover(true)
            }
        }, 200)
    }

    const mouseOut = () => {
        if(hover){
            setHover(false)
        }
    } 

    return (
        <Link href={genLink()}>
            <motion.div
                variants={borderVariants}
                initial="start"
                animate="end"
                transition={borderTransition}
                className="p-[1px] hover:rgb rounded-lg">
                <div className="max-[640px]:max-w-[78vw] w-full p-4 grid items-center h-fit rounded-lg hover:shadow-xl bg-white dark:bg-slate-800">
                    {videoData.mediaType == 0 ? (
                        <div className="relative w-full aspect-video rounded-md bg-transparent" onMouseEnter={() => { mouseEnter() }} onMouseOutCapture={() => { mouseOut() }} onMouseLeave={() => { mouseOut() }}>
                            {hover ? <QuickPlayer mediaData={videoData} className="w-full h-full rounded-md" /> : videoData && videoData.thumbnail ? (
                                <Image
                                    alt=""
                                    className="rounded-md bg-transparent"
                                    fill
                                    sizes="16/9"
                                    src={videoData.thumbnail} 
                                    loading="lazy"
                                />
                            ) : (
                                <Skeleton className="w-full h-full rounded-md" />
                            )
                            }
                        </div>

                    ) : (
                        <div className="relative w-full aspect-video rounded-md bg-opacity-40 bg-slate-100 flex justify-center" onMouseEnter={() => { mouseEnter() }} onMouseOutCapture={() => { mouseOut() }}>
                            {hover ? <QuickPlayer mediaData={videoData} className="absolute left-0 top-0 w-full h-full rounded-md" /> : <div className="h-full aspect-square relative">
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
                            }
                            {(videoData.mediaType == 1 ||
                                videoData.mediaType == 2) && (
                                    <div
                                        className={`${videoData.mediaType == 1
                                            ? "bg-red-600"
                                            : "bg-slate-600"
                                            } text-white px-1 py-[1px] absolute bottom-1 left-1 text-xs`}
                                    >
                                        Trực tiếp
                                    </div>
                                )}
                        </div>
                    )}
                    <div className="flex w-full gap-3 pt-1 px-2">
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
            </motion.div>
        </Link>
    );
}
