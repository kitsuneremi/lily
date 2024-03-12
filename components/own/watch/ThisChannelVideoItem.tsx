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
import { Media } from "@/prisma/type";

export default function VideoItem({
    videoData,
}: {
    videoData: Media;
}) {
    return (
        <Link
            href={`/watch/${videoData.link}`}
            className="max-[640px]:max-w-[78vw] w-full"
        >
            <div className="flex gap-3 w-full items-center">
                <div className="relative flex-0 w-[40%] pt-[25%] h-fit rounded-md bg-transparent">
                    {videoData ? (
                        <Image
                            alt=""
                            className="rounded-md bg-transparent"
                            fill
                            src={videoData.thumbnailLink}
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
                        <p className="text-sm">{videoData.view} lượt xem</p>
                        <p className="text-sm">
                            {FormatDateTime(videoData.createdTime)}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
