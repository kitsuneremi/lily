"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FormatDateTime } from "@/lib/functional";
import axios from "axios";
import { redirect } from "next/navigation";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Account, Media } from "@/prisma/type";


export default function ChannelHome({
    channelData,
}: {
    channelData: Account
}) {
    const [listPo, setListPo] = useState([]);

    useEffect(() => {
        axios
            .get("/api/video/viewdesc", {
                params: {
                    channelId: channelData.id,
                },
            })
            .then((res) => {
                setListPo(res.data);
            });
    }, [channelData.id]);

    return (
        <div className="flex flex-col">
            <div className="flex flex-col gap-2">
                <div className="flex gap-5 px-5">
                    <p className="text-lg font-semibold">Video phổ biến</p>
                    {/* <p className="flex gap-2 items-center">
                        <FaPlay /> Phát toàn bộ
                    </p> */}
                </div>

                <div className="overflow-x-auto relative w-full grid grid-flow-col h-max gap-3">

                </div>
                <Carousel>
                    <CarouselContent>
                        {listPo.map((video, index) => {
                            // @ts-ignore
                            return <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"><VideoItem videoData={video.videoData} key={index} /></CarouselItem>;
                        })}
                    </CarouselContent>
                </Carousel>


            </div>
        </div>
    );
}

const VideoItem = ({ videoData }: {videoData: Media}) => {
    return (
        <div
            className="flex flex-col cursor-pointer w-full h-max shadow-lg p-3 border-[1px] border-slate-600 border-opacity-10 rounded-xl hover:scale-105   "
            onClick={() => redirect(`/watch/${videoData.link}`)}
        >
            {videoData.mediaType == 0 ? (
                <div className="relative w-full aspect-video rounded-md bg-transparent">
                    {videoData && videoData.thumbnailLink ? (
                        <Image
                            alt=""
                            className="rounded-md bg-transparent"
                            fill
                            sizes="16/9"
                            src={videoData.thumbnailLink}
                            loading="lazy"
                        />
                    ) : (
                        <></>
                    )}
                </div>
            ) : (
                <div className="relative w-full aspect-video rounded-md bg-opacity-40 bg-slate-100 flex justify-center">
                    <div className="h-full aspect-square relative">
                        {videoData && videoData.thumbnailLink ? (
                            <Image
                                alt=""
                                className="rounded-md bg-transparent"
                                fill
                                sizes="1/1"
                                src={videoData.thumbnailLink}
                                loading="lazy"
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                    {(videoData.mediaType == 1 || videoData.mediaType == 2) && (
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
            <div className="max-h-14 text-lg font-bold my-2">
                <p>{videoData.title}</p>
            </div>
            <div className="flex justify-between max-h-7 text-xs font-thin">
                <p className="">{videoData.view} lượt xem</p>
                <p>{FormatDateTime(videoData.createdTime)}</p>
            </div>
        </div>
    );
};
