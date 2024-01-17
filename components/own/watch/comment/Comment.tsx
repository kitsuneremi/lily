"use client";
import VideoSuggest from "@/components/own/watch/VideoSuggest/VideoSuggest";
import React, {
    useEffect,
    useRef,
    useState,
    useLayoutEffect,
    FormEvent,
} from "react";
import {
    BigVideoDataType,
    ChannelDataType,
    CommentDataType,
    SubcribeType,
    MediaDataType,
    VideoWithoutComment,
} from "@/types/type";

import CommentItem from "@/components/own/watch/comment/CommentItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationOutlined } from "@ant-design/icons";
import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocalStorage, useEffectOnce } from "usehooks-ts";
import { redirect } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Comment({ fullscreen, commentData, videoData }: { fullscreen: boolean, commentData: CommentDataType[], videoData: BigVideoDataType }) {

    const CommentRender = () => {
        if (commentData == undefined) {
            return (
                <div className="flex justify-center py-3 gap-3">
                    <Skeleton className="w-[45px] h-[45px] rounded-full" />
                    <div className="flex flex-1 flex-col gap-2">
                        <Skeleton className="w-16 h-full rounded-lg" />
                        <Skeleton className="w-full h-full rounded-lg" />
                        <Skeleton className="w-10 h-full rounded-lg" />
                    </div>
                </div>
            )
        } else if (commentData.length == 0) {
            return (
                <div className="flex justify-center py-3">
                    <p>video này chưa có bình luận nào</p>
                </div>
            )
        } else {
            return (
                commentData.map((cmt, index) => {
                    return <CommentItem key={index} cmt={cmt} />;
                })
            )


        }

    };

    return (
        <>
            <div
                className={`flex flex-col gap-2 ${fullscreen ? "px-3" : ""
                    }`}
            >

                <Tabs
                    defaultValue="comment"
                    className="w-full lg:hidden"
                >
                    <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="comment">
                            Comment
                        </TabsTrigger>
                        <TabsTrigger value="video">Video</TabsTrigger>
                    </TabsList>
                    <TabsContent value="comment" className="mb-6">
                        <CommentRender />
                    </TabsContent>
                    <TabsContent value="video">
                        <div className="h-80">
                            <VideoSuggest
                                //@ts-ignore
                                accountId={session?.user.id}
                                channelData={videoData.channelData}
                                videoId={videoData.videoData.id}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
                <div className="flex-col gap-2 my-4 hidden lg:flex mb-6">
                    <CommentRender />
                </div>
            </div>
        </>
    )
}