import { BigVideoDataType, CommentDataType } from "@/types/type";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BiMenuAltLeft } from "react-icons/bi";
import React, {
    useEffect,
    useRef,
    useState,
    FormEvent,
    useCallback,
} from "react";
import CommentItem from "@/components/own/watch/comment/CommentItem";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { useEffectOnce } from 'usehooks-ts'
import VideoSuggest from "@/components/own/watch/VIdeoSuggest";
import Properties from "@/components/own/watch/Properties";
import Description from "@/components/own/watch/Description";
import { FaXmark } from "react-icons/fa6";

export default function Expand({ fullscreen, videoData }: { fullscreen: boolean, videoData: BigVideoDataType}) {
    const { data: session, status } = useSession();
    const [commentData, setCommentData] = useState<CommentDataType[]>();
    const commentInputRef = useRef<HTMLInputElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    const { toast } = useToast();

    const [show, setShow] = useState<boolean>(false);
    const [top, setTop] = useState<number>()

    // useEffect(() => {
    //     if (rel) {
    //         const rect = rel.getBoundingClientRect();
    //         console.log(rect)
    //         setTop(rect.bottom)
    //     }
    // }, [rel])

    useEffect(() => {
        const rect = boxRef.current?.getBoundingClientRect();
        if(rect){
            console.log(rect)
            setTop(rect.top)
        }
    },[boxRef.current])

    useEffectOnce(() => {
        axios
            .get("/api/comments/data", {
                params: {
                    videoId: videoData.videoData.id,
                },
            })
            .then((res) => {
                setCommentData(res.data);
            });
    });

    const handleSubmitComment = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (status == "authenticated") {
                axios
                    .post("/api/comments/create", {
                        videoId: videoData.videoData.id,
                        //@ts-ignore
                        accountId: session.user.id,
                        content: commentInputRef.current?.value,
                    })
                    .then((res) => {
                        commentInputRef.current!.value = "";
                        setCommentData(res.data);
                    });
            } else {
                toast({
                    title: "chưa thể đăng bình luận",
                    description: "bạn chưa đăng nhập",
                });
            }
        },
        [session]
    );

    const CommentRender = useCallback(() => {
        if (commentData == undefined) {
            return (
                <div className="flex justify-center py-3 gap-3">
                    <Skeleton className="w-[45px] h-[45px] max-sm:w-4 max-sm:h-4 rounded-full" />
                    <div className="flex flex-1 flex-col gap-2">
                        <Skeleton className="w-16 h-full rounded-lg" />
                        <Skeleton className="w-full h-full rounded-lg" />
                        <Skeleton className="w-10 h-full rounded-lg" />
                    </div>
                </div>
            );
        } else if (commentData.length == 0) {
            return (
                <div className="flex justify-center py-3">
                    <p>video này chưa có bình luận nào</p>
                </div>
            );
        } else {
            return commentData.map((cmt, index) => {
                return <CommentItem key={index} cmt={cmt} />;
            });
        }
    }, [commentData]);

    const HandleCurrentAccountAvatarRender = useCallback(() => {
        if (status === "loading") {
            return <Skeleton className="w-full h-full rounded-full" />;
        } else if (status == "authenticated") {
            return (
                <Image
                    alt=""
                    className="my-auto bg-transparent rounded-full"
                    src={session.user.image}
                    sizes="1/1"
                    fill
                />
            );
        } else {
            return (
                <Image
                    alt=""
                    className="my-auto rounded-full bg-transparent animate-spin"
                    src={
                        "https://danviet.mediacdn.vn/upload/2-2019/images/2019-04-02/Vi-sao-Kha-Banh-tro-thanh-hien-tuong-dinh-dam-tren-mang-xa-hoi-khabanh-1554192528-width660height597.jpg"
                    }
                    fill
                    sizes="1/1"
                />
            );
        }
    }, [session, status]);

    const Test = useCallback(() => {
        return (
            <div className='flex flex-col gap-3'>
                <div className="flex justify-between px-3 items-center">
                    <div className="flex gap-2 items-center">
                        <div className="flex gap-2 max-[400px]:flex-col">
                            <div className="flex gap-2 items-center">
                                <p>{videoData.videoData.mediaType == 0 ? 'Bình luận' : videoData.videoData.mediaType == 1 ? 'Trò chuyện trực tiếp' : 'Trò chuyện trước đó'}</p>
                                <p>{videoData.commentData.length}</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-none">
                                    <div className="flex items-center gap-2 py-2 rounded-[24px] hover:bg-slate-300 dark:hover:bg-slate-800">
                                        <BiMenuAltLeft />
                                        Sắp xếp theo
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <div className="p-1 rounded-lg">
                                        <DropdownMenuItem>
                                            Bình luận hàng đầu
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Thời gian
                                        </DropdownMenuItem>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div onClick={() => { setShow(false) }}><FaXmark /></div>
                </div>
                <div className="flex gap-3 px-3 shadow">
                    <div className="h-9 w-9 max-[400px]:h-6 max-[400px]:w-6 relative">
                        <HandleCurrentAccountAvatarRender />
                    </div>
                    <form
                        onSubmit={(e) => {
                            handleSubmitComment(e);
                        }}
                        className="flex-grow flex items-center"
                    >
                        <input
                            type="text"
                            name="cmt"
                            ref={commentInputRef}
                            className="w-full outline-none border-b-[1px] bg-transparent border-slate-400 focus:border-slate-500 flex-grow"
                        />
                        <button
                            type="submit"
                            className="mt-1 w-fit px-3 py-2 self-end hover:bg-slate-300 dark:hover:bg-slate-700 rounded-3xl flex-shrink-0"
                        >
                            bình luận
                        </button>
                    </form>
                </div>
                <div className="flex-1 pb-5 overflow-y-scroll hidden-scrollbar">
                    <CommentRender />
                </div>
            </div>
        )
    }, [commentData])

    const CommentOpenBox = () => {
        if (commentData == undefined) {
            return (
                <div className="flex justify-center py-3 gap-3">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <div className="flex flex-1 flex-col gap-2">
                        <Skeleton className="w-full h-full rounded-lg" />
                    </div>
                </div>
            );
        } else {
            return (
                <>
                    <div className="flex gap-2">
                        <p>{videoData.videoData.mediaType == 0 ? 'Bình luận' : videoData.videoData.mediaType == 1 ? 'Trò chuyện trực tiếp' : 'Bình luận'}</p>
                        <p>{videoData.commentData.length}</p>
                    </div>

                    {commentData.length > 0 && videoData.videoData.mediaType == 1 ?
                        <div className="flex gap-2">
                            <div className="w-5 h-5 relative">
                                {HandleCurrentAccountAvatarRender()}
                            </div>
                            <input type="text" disabled placeholder="Nhập bình luận của bạn" className="w-full bg-transparent outline-none border-0" />
                        </div>
                        :
                        <div>
                            <p>Chưa có bình luận nào</p>
                        </div>
                    }
                </>
            )
        }
    }

    return (
        <div className="" ref={boxRef}>
            {/* video property */}
            <Properties videoData={videoData} fullscreen />
            {/* des */}
            {/* @ts-ignore */}
            <Description createdTime={videoData.videoData.createdTime} des={videoData.videoData.des} fullscreen mediaType={videoData.videoData.mediaType} view={videoData.videoData.view} />
            {/* comment */}
            <div className="w-full h-fit">
                <div className="flex gap-3 max-lg:hidden">
                    <div className="h-9 w-9 relative">
                        <HandleCurrentAccountAvatarRender />
                    </div>
                    <form
                        onSubmit={(e) => {
                            handleSubmitComment(e);
                        }}
                        className="flex-grow flex flex-col items-end"
                    >
                        <input
                            type="text"
                            name="cmt"
                            ref={commentInputRef}
                            className="w-full outline-none border-b-[1px] bg-transparent border-slate-400 focus:border-slate-500 flex-grow"
                        />
                        <button
                            type="submit"
                            className="mt-1 px-3 py-2 self-end hover:bg-slate-300 dark:hover:bg-slate-700 rounded-3xl"
                        >
                            bình luận
                        </button>
                    </form>
                </div>
                {!show && <div className={`flex flex-col gap-2 max-lg:dark:bg-slate-700 max-lg:bg-slate-200 lg:hidden py-5 rounded-lg ${fullscreen ? "px-3" : ""}`} onClick={() => { setShow(true) }}>
                    {CommentOpenBox()}
                </div>}
                <div className="max-lg:hidden pb-5">
                    <CommentRender />
                </div>
            </div>
            {show && top && <div style={{ top: `${Math.floor(top) - 76}px`, height: window.innerHeight - Math.floor(top) }} className={`absolute w-[calc(100vw-24px)] mt-2 min-h-full left-3 z-50 px-6 max-sm:px-1 bg-slate-200 dark:bg-slate-700 rounded-lg`}>
                {Test()}
            </div>}
        </div>
    )
} {/* <div className="flex gap-3 px-3">
<p className="my-auto h-fit">
    {videoData.commentData.length} bình luận
</p>
<DropdownMenu>
    <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center gap-2 px-3 py-2 rounded-[24px] hover:bg-slate-300 dark:hover:bg-slate-800">
            <BiMenuAltLeft />
            Sắp xếp theo
        </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
        <div className="p-1 rounded-lg">
            <DropdownMenuItem>
                Bình luận hàng đầu
            </DropdownMenuItem>
            <DropdownMenuItem>
                Thời gian
            </DropdownMenuItem>
        </div>
    </DropdownMenuContent>
</DropdownMenu>
</div>


<div className="flex-col gap-2 my-4 hidden lg:flex mb-6">
<CommentRender />
<div className='flex flex-col gap-3'>
    <div className="flex gap-2">
        <p>Bình luận</p>
        <p>{videoData.commentData.length}</p>
    </div>
    <>
        {videoData.commentData.length > 0 ?
            <div className="flex gap-2">
                {
                    videoData.commentData[0].accountImage
                    &&
                    <>
                        <Image src={videoData.commentData[0].accountImage} width={20} height={20} className="rounded-full" alt="" />
                        <p>{videoData.commentData[0].content}</p>
                    </>
                }
            </div>
            : <p>Chưa có bình luận nào</p>
        }
    </>
</div>
</div>
<div className="sm:hidden">
<VideoSuggest
    channelData={videoData.channelData}
    videoId={videoData.videoData.id}
/>
</div> */}