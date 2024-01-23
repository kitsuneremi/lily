"use client";
import { ChannelDataType, MediaDataType, SessionDataType } from "@/types/type";
import Image from "next/image";
import { ReduceString, FormatDateTime } from "@/lib/functional";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useEffectOnce } from "usehooks-ts";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import SubcribeButton from "@/components/own/SubcribeButton";

export default function ResultPage({
    data,
    session,
}: {
    data: {
        channels: ChannelDataType[];
        videos: MediaDataType[];
    };
    session: SessionDataType | null;
}) {
    const [tab, setTab] = useState<number>(0);

    useEffectOnce(() => {
        console.log(data.channels[0]);
    });

    const tabViewRender = () => {
        if (tab == 0) {
            return (
                <>
                    {/* <div
                        className={`${
                            data.channels.length > 0 ? "w-3/5" : "w-full"
                        } flex flex-col gap-3`}
                    > */}
                    <div className="w-full flex flex-col gap-3">
                        {data.channels.length > 0 && (
                            <>
                                <Link
                                    href={`/channel/${data.channels[0].tagName}`}
                                >
                                    <div className="flex gap-6 w-max p-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
                                        <div className="w-72 aspect-video flex justify-center items-center">
                                            <div className="relative h-full aspect-square">
                                                {data.channels[0]
                                                    .avatarImage ? (
                                                    <Image
                                                        src={
                                                            data.channels[0]
                                                                .avatarImage
                                                        }
                                                        alt="avatar"
                                                        fill
                                                        className="rounded-full"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <Skeleton className="w-full h-full rounded-full" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-10 flex-1 flex-shrink-0">
                                            <div className="flex flex-col gap-3">
                                                <p className="text-xl">
                                                    {data.channels[0].name}
                                                </p>
                                                <div className="flex gap-3">
                                                    <p className="text-sm">
                                                        @
                                                        {
                                                            data.channels[0]
                                                                .tagName
                                                        }
                                                    </p>
                                                    <p className="text-sm">
                                                        {data.channels[0].sub}{" "}
                                                        người đăng ký
                                                    </p>
                                                </div>
                                                <p className="text-sm">
                                                    {data.channels[0].des}
                                                </p>
                                            </div>
                                            <div className="flex h-full flex-col justify-center items-center">
                                                <SubcribeButton channelData={data.channels[0]} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                <div className="relative w-full m-2 h-[1px] after:absolute after:w-[80%] after:h-[1px] after:bg-slate-600 after:bottom-0 after:left-0"></div>
                            </>
                        )}
                        {VideoRender(data.videos)}
                    </div>
                    {/* <div
                        className={`${
                            data.channels.length > 0 ? "w-1/5" : "hidden"
                        }  h-full flex flex-col`}
                    >
                        <div className="flex">
                            <div className="w-1/3 p-2">
                                <div className="relative aspect-square">
                                    {data.channels[0].avatarImage ? (
                                        <Image
                                            src={data.channels[0].avatarImage}
                                            alt="avatar"
                                            fill
                                            className="rounded-full"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <Skeleton className="w-full h-full rounded-full" />
                                    )}
                                </div>
                            </div>
                            <div className="w-2/3 flex flex-col">
                                <p className="text-xl font-bold">
                                    {data.channels[0].name}
                                </p>
                                <div className="flex gap-3">
                                    <p className="text-sm">
                                        @{data.channels[0].tagName}
                                    </p>
                                    <p className="text-sm">
                                        {data.channels[0].sub} người đăng ký
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </>
            );
        }
    };
    return (
        <div className="w-full h-full flex flex-col gap-3 items-start xl:pl-[8%] lg:pl-[5%]">
            <div className="flex gap-2">
                <button
                    className={`px-4 py-1 font-bold bg-slate-100 hover:bg-slate-300 dark:bg-slate-700 rounded-lg ${tab == 0 ? "bg-slate-800 text-white hover:bg-slate-800" : ""
                        }`}
                >
                    tất cả
                </button>
            </div>
            <div className="w-full h-full flex justify-around overflow-y-scroll">
                {tabViewRender()}
            </div>
        </div>
    );
}

const VideoRender = (listVideo: MediaDataType[]) => {
    return listVideo.map((video, index) => {
        return (
            <Link
                href={`${video.mediaType == 1 ? "/stream" : "/watch"}/${video.link
                    }`}
                key={index}
            >
                <div className="flex gap-6 w-max items-stretch p-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
                    {video.mediaType == 0 ? (
                        <div className="relative w-72 aspect-video rounded-md bg-transparent">
                            {video && video.thumbnail ? (
                                <Image
                                    alt=""
                                    className="rounded-md bg-transparent max-h-[220px]"
                                    fill
                                    sizes="16/9"
                                    src={video.thumbnail}
                                    loading="lazy"
                                />
                            ) : (
                                <Skeleton className=" rounded-lg" />
                            )}
                        </div>
                    ) : (
                        <div className="relative w-72 aspect-video rounded-md bg-opacity-40 bg-slate-200 flex justify-center items-stretch">
                            <div className="relative aspect-square h-full inset-0 flex items-center justify-center">
                                {video && video.thumbnail ? (
                                    <Image
                                        alt=""
                                        className="rounded-md bg-transparent  max-h-[220px]"
                                        fill
                                        sizes="1/1"
                                        src={video.thumbnail}
                                        loading="lazy"
                                    />
                                ) : (
                                    <Skeleton className=" rounded-lg" />
                                )}
                            </div>

                            {(video.mediaType == 1 || video.mediaType == 2) && (
                                <div
                                    className={`${video.mediaType == 1
                                            ? "bg-red-600"
                                            : "bg-slate-600"
                                        } text-white px-1 py-[1px] absolute bottom-1 left-1 text-xs`}
                                >
                                    Trực tiếp
                                </div>
                            )}
                        </div>
                    )}
                    <div className="flex flex-col gap-3 w-max flex-shrink-0">
                        <p className="text-xl font-bold">
                            {ReduceString({
                                string: video.title,
                                maxLength: 70,
                            })}
                        </p>
                        <div className="flex gap-2">
                            <p className="text-xs text-zinc-600 dark:text-zinc-300">
                                {video.view} lượt xem
                            </p>
                            <p className="text-xs text-zinc-600 dark:text-zinc-300">
                                {video.mediaType == 0
                                    ? ""
                                    : video.mediaType == 1
                                        ? "Đã bắt đầu "
                                        : "Đã phát trực tiếp "}
                                {FormatDateTime(video.createdTime)}
                            </p>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Link
                                        href={`/channel/${video.Channels?.tagName}`}
                                    >
                                        <div className="flex gap-3 items-center">
                                            <div className="relative w-[40px] aspect-square">
                                                {video.Channels &&
                                                    video.Channels.avatarImage ? (
                                                    <Image
                                                        src={
                                                            video.Channels
                                                                .avatarImage
                                                        }
                                                        fill
                                                        loading="lazy"
                                                        className="rounded-full"
                                                        alt="avatar"
                                                    />
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                            {video.Channels ? (
                                                <p className="text-lg hover:text-xl hover:text-slate-700 dark:hover:text-slate-300">
                                                    {video.Channels.name}
                                                </p>
                                            ) : (
                                                <Skeleton className="w-10 h-4 rounded-lg" />
                                            )}
                                        </div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent align="start">
                                    <p>
                                        chuyển hướng tới kênh{" "}
                                        {video.Channels?.name}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <p className="text-base text-zinc-600 dark:text-zinc-300">
                            {ReduceString({ string: video.des, maxLength: 80 })}
                        </p>
                    </div>
                </div>
            </Link>
        );
    });
};
