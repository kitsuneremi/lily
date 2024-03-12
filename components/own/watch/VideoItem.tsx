"use client";
import Link from "next/link";
import Image from "next/image";
import { FormatDateTime, ReduceString } from "@/lib/functional";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Account, Media } from "@/prisma/type";

export default function VideoItem({
    videoData,
    channelData,
}: {
    videoData: Media;
    channelData: Account;
}) {
    return (
        <Link
            href={`/watch/${videoData.link}`}
            className="w-full"
        >
            <div className="grid items-center h-fit w-full">
                <div className="relative w-full h-fit min-h-[120px] pt-[56.25%] rounded-md bg-transparent">
                    {videoData.thumbnailLink ? (
                        <Image
                            alt=""
                            className="rounded-md bg-transparent"
                            fill
                            src={videoData.thumbnailLink}
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
                                        {channelData && channelData.avatarLink ? (
                                            <Image
                                                className="rounded-full bg-transparent"
                                                alt="img"
                                                width={30}
                                                height={30}
                                                loading="lazy"
                                                src={channelData.avatarLink}
                                            />
                                        ) : (
                                            <Skeleton className="w-[30px] h-[30px] rounded-full" />
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
                                {FormatDateTime(videoData.createdTime)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
