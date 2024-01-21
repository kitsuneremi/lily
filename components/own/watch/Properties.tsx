import { BigVideoDataType } from "@/types/type";
import { useState, useEffect, useCallback } from "react";
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai";
import { MdFileDownload } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa";
import { IoFlagOutline } from "react-icons/io5";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { useSession } from "next-auth/react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import SubcribeButton from "@/components/own/SubcribeButton";
import { AiOutlineShareAlt } from "react-icons/ai";

export default function Properties({ videoData, fullscreen }: { videoData: BigVideoDataType, fullscreen: boolean }) {

    const [like, setLike] = useState<boolean>(false);
    const [dislike, setDislike] = useState<boolean>(false);

    const { data: session, status } = useSession();

    useEffect(() => {
        if (session && session.user) {
            axios
                .get("/api/like/find", {
                    params: {
                        accountId: session.user.id,
                        targetId: videoData.channelData.id,
                    },
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`,
                    },
                })
                .then((val) => {
                    if (val.data.type == null) {
                        setLike(false);
                        setDislike(false);
                    } else {
                        if (val.data.type == 0) {
                            setLike(true);
                            setDislike(false);
                        } else {
                            setLike(false);
                            setDislike(true);
                        }
                    }
                });
        }
    }, [session]);

    const handleLike = useCallback(() => {
        if (session && session.user) {
            if (like) {
                setLike(false);
                setDislike(false);
                axios.post("/api/like/delete", {
                    // @ts-ignore
                    accountId: session.user.id,
                    targetId: videoData.channelData.id,
                });
            } else {
                setLike(true);
                setDislike(false);
                axios.post("/api/like/add", {
                    // @ts-ignore
                    accountId: session.user.id,
                    targetId: videoData.channelData.id,
                    type: 0,
                });
            }
        }
    }, []);

    const handleDislike = useCallback(() => {
        if (session && session.user) {
            setDislike(!dislike);
            setLike(false);
            if (dislike) {
                axios.post("/api/like/delete", {
                    // @ts-ignore
                    accountId: session.user.id,
                    targetId: videoData.channelData.id,
                });
            } else {
                axios.post("/api/like/add", {
                    // @ts-ignore
                    accountId: session.user.id,
                    targetChannel: videoData.channelData.id,
                    type: 1,
                });
            }
        }
    }, []);

    return (
        <div
            className={`max-sm:px-2 mt-2 ${fullscreen ? "px-3" : ""
                }`}
        >
            <p className="text-3xl font-bold my-3">
                {videoData.videoData.title}
            </p>
            <div className="flex justify-between max-sm:flex-col">
                <div className="flex gap-2">
                    {/* channel img + sub count */}
                    <div className="flex gap-3">
                        <div className="flex flex-col justify-center">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link
                                            href={`/channel/${videoData.channelData.tagName}`}
                                        >
                                            <div className="relative lg:w-[55px] lg:h-[55px] max-sm:w-[45px] max-sm:h-[45px] w-[40px] h-[40px]">
                                                {videoData
                                                    .channelData
                                                    .avatarImage && (
                                                        <Image
                                                            src={
                                                                videoData
                                                                    .channelData
                                                                    .avatarImage
                                                            }
                                                            alt=""
                                                            className="rounded-full bg-transparent"
                                                            sizes="1/1"
                                                            fill
                                                        />
                                                    )}
                                            </div>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            chuyển hướng tới kênh{" "}
                                            {
                                                videoData
                                                    .channelData
                                                    .name
                                            }
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="flex flex-col w-max gap-2 flex-shrink-0">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link
                                            href={`/channel/${videoData.channelData.tagName}`}
                                        >
                                            <p className="text-xl font-semibold text-start">
                                                {
                                                    videoData
                                                        .channelData
                                                        .name
                                                }
                                            </p>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            chuyển hướng tới kênh{" "}
                                            {
                                                videoData
                                                    .channelData
                                                    .name
                                            }
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <p className="w-fit">
                                {videoData.channelData.sub} Người
                                đăng ký
                            </p>
                        </div>
                    </div>

                    <div className="flex px-3 py-2 max-sm:w-full">
                        <SubcribeButton channelData={videoData.channelData} />
                    </div>
                </div>
                <div className="flex items-center gap-3 max-sm:overflow-x-scroll max-sm:w-full max-sm:my-2 hidden-scrollbar">
                    <div className="flex my-auto rounded-[24px] border-[1px]">
                        <div className="flex gap-1 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 py-2 px-3 rounded-s-3xl cursor-pointer">
                            <div
                                className="flex flex-col justify-center"
                                onClick={() => {
                                    handleLike();
                                }}
                            >
                                {like ? (
                                    <AiFillLike />
                                ) : (
                                    <AiOutlineLike />
                                )}
                            </div>
                            <p>{videoData.videoData.like}</p>
                        </div>
                        <div className="relative after:absolute after:bg-slate-300 after:h-[80%] after:top-[10%] after:w-[1px]"></div>
                        <div
                            className="flex flex-col justify-center dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 py-2 px-3 rounded-e-3xl cursor-pointer"
                            onClick={() => {
                                handleDislike();
                            }}
                        >
                            {dislike ? (
                                <AiFillDislike />
                            ) : (
                                <AiOutlineDislike />
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 items-center justify-center h-fit px-3 py-2 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 border-[1px] rounded-full">
                        <AiOutlineShareAlt />
                        <p>Chia sẻ</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 items-center justify-center h-fit px-3 py-2 sm:hidden dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 border-[1px] rounded-full">
                        <MdFileDownload />
                        <p>Tải xuống</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 items-center justify-center h-fit px-3 py-2 sm:hidden dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 border-[1px] rounded-full">
                        <FaRegBookmark />
                        <p>Lưu</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 items-center justify-center h-fit px-3 py-2 sm:hidden dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 border-[1px] rounded-full">
                        <IoFlagOutline />
                        <p>Báo cáo vi phạm</p>
                    </div>
                </div>
            </div>
        </div>
    )
}