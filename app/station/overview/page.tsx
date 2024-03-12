"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import { AiFillLike } from "react-icons/ai";
import { TfiBarChart } from "react-icons/tfi";
import { BiCommentDetail } from "react-icons/bi";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Account, Media } from "@/prisma/type";

export default function Page() {
    const [channelData, setChannelData] = useState<Account>();
    const [latestVideoData, setLatestVideoData] = useState<Media>();
    const { data: session } = useSession();

    useEffect(() => {
        if (session && session.user) {
            axios
                .get("/api/channel/data", {
                    params: {
                        //@ts-ignore
                        accountId: session.user.id,
                    },
                })
                .then((res) => setChannelData(res.data));
        }
    }, [session]);

    useEffect(() => {
        if (channelData) {
            axios
                .get("/api/video/channellatest", {
                    params: {
                        channelId: channelData.id,
                    },
                })
                .then((res) => {
                    if (res.status) {
                        setLatestVideoData(res.data);
                    }
                });
        }
    }, [channelData]);

    return (
        <div className="h-[calc(100vh-64px)] overflow-y-scroll hidden-scroll w-full">
            <p className="text-3xl font-extrabold mb-7">
                Trang tổng quan về kênh
            </p>
            <div className="grid grid-cols-4 text-center">
                <div className="px-4 bg-slate-200 dark:bg-slate-800 rounded-lg">
                    <p className="text-xl font-bold my-4">
                        Hiệu suất video mới nhất
                    </p>
                    <div className="relative w-full pt-[56.25%]">
                        <Image
                            src={latestVideoData?.thumbnailLink ? latestVideoData?.thumbnailLink : ''}
                            fill
                            alt=""
                            sizes="16/9"
                            priority
                        />
                    </div>
                    <p className="text-lg font-bold text-center pl-3">
                        {latestVideoData?.title}
                    </p>
                    <div className="flex justify-around pb-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex gap-1 items-center">
                                        <TfiBarChart />
                                        <p>{latestVideoData?.view}</p>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>số lượt xem</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex gap-1 items-center">
                                        <BiCommentDetail />
                                        <p>{latestVideoData?.Comment.length}</p>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>số lượt bình luận</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex gap-1 items-center">
                                        <AiFillLike />
                                        <p>{latestVideoData?.Likes.length}</p>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>số lượt thích</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <p className="text-xl font-bold my-4">Số liệu phân tích kênh</p>
                    <div className="flex flex-col">
                        <div className="flex flex-col">
                            <p>Số người đăng ký hiện tại</p>
                            <p>{channelData?.Subcribes.length}</p>
                        </div>
                    </div>
                    <div className="h-[1px] my-2 w-full relative after:absolute after:w-[90%] after:h-[1px] after:bg-slate-400 after:bottom-0 after:left-[5%]"></div>
                    <div className="flex flex-col">???</div>
                </div>

                <div>
                    <p>Bình luận</p>
                </div>

                <div>
                    <p>Người đăng ký</p>
                </div>
            </div>
        </div>
    );
}
