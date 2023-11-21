"use client";
import { BigVideoDataType, ChannelDataType, MediaDataType } from "@/types/type";
import { FaPlay } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FormatDateTime } from "@/lib/functional";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import axios from "axios";
import { redirect } from "next/navigation";

export default function ChannelHome({
    channelData,
}: {
    channelData: ChannelDataType;
}) {
    const [listPo, setListPo] = useState<BigVideoDataType[]>([]);

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
    }, []);

    return (
        <div className="flex flex-col">
            <div className="flex flex-col gap-3">
                <div className="flex gap-5">
                    <p>Video phổ cmn biến</p>
                    <p className="flex gap-2 items-center">
                        <FaPlay /> Phát cmn hết
                    </p>
                </div>
                <div className="overflow-x-scroll hidden-scrollbar w-full grid grid-flow-col-dense h-max gap-3">
                    {listPo.map((video, index) => {
                        return <VideoItem videoData={video.videoData} key={index} />;
                    })}
                </div>
            </div>
        </div>
    );
}

const VideoItem = ({ videoData }: { videoData: MediaDataType }) => {
    return (
        <div
            className="flex flex-col cursor-pointer w-full h-max lg:min-w-[20%]"
            onClick={() => redirect(`/watch/${videoData.link}`)}
        >
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
                    {(videoData.mediaType == 1 || videoData.mediaType == 2) && (
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
            <p>{videoData.title}</p>
            <div className="flex justify-between">
                <p>{videoData.view} lượt xem</p>
                <p>{FormatDateTime(videoData.createdTime)}</p>
            </div>
        </div>
    );
};
