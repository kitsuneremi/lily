"use client";
import LivePlayer from '@/components/own/stream/page';
import Sidebar from "@/components/own/absoluteSidebar";
import Navbar from "@/components/own/navbar";
import Image from "next/image";
import VideoItem from "@/components/own/watch/VideoItem";
import ThisChannelVideoItem from "@/components/own/watch/ThisChannelVideoItem";
import React, {
    useEffect,
    useRef,
    useState,
    useLayoutEffect,
    FormEvent,
} from "react";
import axios from "axios";
import {
    BigVideoDataType,
    ChannelDataType,
    CommentDataType,
    SubcribeType,
    MediaDataType,
    VideoWithoutComment,
} from "@/types/type";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BiMenuAltLeft } from "react-icons/bi";
import { GrNotification } from "react-icons/gr";
import {
    AiOutlineDown,
    AiFillLike,
    AiOutlineLike,
    AiFillDislike,
    AiOutlineDislike,
    AiOutlineShareAlt,
} from "react-icons/ai";
import { FormatDateTime, fileURL, videoTimeFormater } from "@/lib/functional";
import { useSession } from "next-auth/react";
import CommentItem from "@/components/own/watch/comment/CommentItem";
import { handleSubmit } from "@/components/own/watch/comment/CommentInput";
import { ref as fireRef, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import Hls from "hls.js";
import {
    ImVolumeHigh,
    ImVolumeMedium,
    ImVolumeLow,
    ImVolumeMute,
    ImVolumeMute2,
} from "react-icons/im";
import {
    BsFillPlayFill,
    BsFillPauseFill,
    BsArrowsFullscreen,
    BsFullscreenExit,
} from "react-icons/bs";
import { MdSkipNext } from "react-icons/md";
import { AiFillSetting } from "react-icons/ai";
import { Slider } from "antd";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import { RxTrackNext } from "react-icons/rx";
import { NotificationOutlined } from "@ant-design/icons";
import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocalStorage } from "usehooks-ts";
import { useEffectOnce } from "usehooks-ts";
import { redirect } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";


export default function Page({ streamData, channelData }: { streamData: MediaDataType, channelData: ChannelDataType }) {

    const commentInputRef = useRef<HTMLInputElement>(null);
    const ref = useRef<HTMLVideoElement>(null);
    const fullRef = useRef<HTMLDivElement>(null);
    const anyRef = useRef<HTMLDivElement>(null);

    const { data: session, status } = useSession();
    const [like, setLike] = useState<boolean>(false);
    const [dislike, setDislike] = useState<boolean>(false);
    const [hide, setHide] = useState<boolean>(false);
    const [fullscreen, setFullscreen] = useState<boolean>(false);
    const [loadedContent, setLoadedContent] = useState<boolean>(false);

    const [subcribe, setSubcribe] = useState<SubcribeType>();

    useEffect(() => {
        if (fullRef.current && document) {
            if (fullscreen) {
                if (window.innerHeight > window.innerWidth) {
                    fullRef.current.requestFullscreen();
                    //@ts-ignore
                    screen.orientation.lock("landscape");
                } else {
                    fullRef.current.requestFullscreen();
                }
            } else {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            }
        }
    }, [fullscreen]);

    useEffect(() => {
        if (session && session.user) {
            if (session.user.id !== channelData.accountId) {
                axios
                    .get("/api/subcribe", {
                        params: {
                            targetChannel: channelData.id,
                            accountId: session.user.id,
                        },
                    })
                    .then((val) => {
                        setSubcribe(val.data);
                    });
            }
        }
    }, [session]);

    // useEffect(() => {
    //     if (session && session.user) {
    //         axios
    //             .get("/api/like/find", {
    //                 params: {
    //                     // @ts-ignore
    //                     accountId: session.user.id,
    //                     targetId: channelData.id,
    //                 },
    //                 headers: {
    //                     //@ts-ignore
    //                     Authorization: `Bearer ${session.user.accessToken}`,
    //                 },
    //             })
    //             .then((val) => {
    //                 if (val.data.type == null) {
    //                     setLike(false);
    //                     setDislike(false);
    //                 } else {
    //                     if (val.data.type == 0) {
    //                         setLike(true);
    //                         setDislike(false);
    //                     } else {
    //                         setLike(false);
    //                         setDislike(true);
    //                     }
    //                 }
    //             });
    //     }
    // }, [session]);

    const handleLike = () => {
        if (session && session.user) {
            if (like) {
                setLike(false);
                setDislike(false);
                axios.post("/api/like/delete", {
                    accountId: session.user.id,
                    targetId: channelData.id,
                });
            } else {
                setLike(true);
                setDislike(false);
                axios.post("/api/like/add", {
                    accountId: session.user.id,
                    targetId: channelData.id,
                    type: 0,
                });
            }
        }
    };

    const handleDislike = () => {
        if (session && session.user) {
            setDislike(!dislike);
            setLike(false);
            if (dislike) {
                axios.post("/api/like/delete", {
                    accountId: session.user.id,
                    targetId: channelData.id,
                });
            } else {
                axios.post("/api/like/add", {
                    accountId: session.user.id,
                    targetChannel: channelData.id,
                    type: 1,
                });
            }
        }
    };

    const handleSubcribe = () => {
        if (session && session.user) {
            axios
                .post("/api/subcribe/addordelete", {
                    accountId: session.user.id,
                    channelId: channelData.id,
                })
                .then((val) => {
                    setSubcribe(val.data);
                });
        } else {
            redirect("/register");
        }
    };

    const Subcribe = () => {
        if (session && session.user) {
            if (session.user.id === channelData.accountId) {
                return (
                    <div
                        className="px-4 py-2 cursor-pointer rounded-[24px] border-[1px] hover:bg-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800"
                        onClick={() => {
                            redirect("/station");
                        }}
                    >
                        quản lý kênh của bạn
                    </div>
                );
            } else {
                if (subcribe) {
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none max-sm:w-full">
                                <div className="flex gap-2 px-4 py-2 rounded-[24px] border-[1px] hover:bg-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800">
                                    <div className="flex flex-col justify-center animate-bounce dark:text-white">
                                        <NotificationOutlined />
                                    </div>
                                    <p className="my-auto max-sm:w-full">
                                        Đã đăng ký
                                    </p>
                                    <div className="flex flex-col justify-center">
                                        <AiOutlineDown />
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <div className="p-2 rounded-lg select-none">
                                    <DropdownMenuLabel>
                                        Nhận thông báo
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Tất cả</DropdownMenuItem>
                                    <DropdownMenuItem>Hạn chế</DropdownMenuItem>
                                    <DropdownMenuItem>Không</DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            handleSubcribe();
                                        }}
                                    >
                                        Hủy đăng ký
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                } else {
                    return (
                        <>
                            <div
                                className="flex gap-2 px-4 py-2 cursor-pointer rounded-[24px] border-[1px] hover:bg-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800"
                                onClick={() => {
                                    handleSubcribe();
                                }}
                            >
                                <p className="my-auto max-sm:w-full">Đăng ký</p>
                            </div>
                        </>
                    );
                }
            }
        }
    };

    return (
        <>
            <div className="w-full flex flex-col h-screen">
                <div className="w-screen h-16 flex justify-between fixed top-0 left-0 px-3 lg:px-8 py-4 bg-white dark:bg-[#020817] z-10">
                    <Navbar />
                </div>
                <div className="flex h-[calc(100vh-64px)] overflow-y-clip">
                    <Sidebar />
                    <div
                        className={`relative ${fullscreen ? "mt-0" : "mt-3"
                            } gap-10 h-full w-full overflow-y-scroll`}
                    >
                        <div className="lg:flex">
                            <div
                                ref={fullRef}
                                className={`flex group flex-col w-full  ${fullscreen
                                    ? "absolute w-screen top-0 left-0 bg-white dark:bg-slate-600 overflow-y-scroll p-0 hidden-scrollbar"
                                    : `relative lg:w-3/4 lg:px-10 max-sm:px-2 px-5`
                                    }`}
                            >
                                <div
                                    ref={anyRef}
                                    className={`flex justify-center relative ${loadedContent ? "" : "pt-[56.25%] max-h-[80vh]"
                                        } ${fullscreen ? "w-full h-screen" : ""} rounded-xl`}
                                >
                                    <LivePlayer name={channelData.tagName} streamData={streamData} />
                                </div>

                                {/* video property */}
                                <div
                                    className={`max-sm:px-2 mt-2 ${fullscreen ? "px-3" : ""
                                        }`}
                                >
                                    <p className="text-3xl font-bold my-3">
                                        {streamData.title}
                                    </p>
                                    <div className="flex justify-between max-sm:flex-col">
                                        <div className="flex gap-2 max-sm:flex-col">
                                            <div className="flex gap-3">
                                                <div className="flex flex-col justify-center">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Link
                                                                    href={`/channel/${channelData.tagName}`}
                                                                >
                                                                    <div className="relative lg:w-[55px] lg:h-[55px] max-sm:w-[45px] max-sm:h-[45px] w-[40px] h-[40px]">
                                                                        {channelData.avatarImage && (
                                                                            <Image
                                                                                src={
                                                                                    channelData.avatarImage
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
                                                                        channelData
                                                                            .name
                                                                    }
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Link
                                                                    href={`/channel/${channelData.tagName}`}
                                                                >
                                                                    <p className="text-xl font-semibold text-start">
                                                                        {
                                                                            channelData
                                                                                .name
                                                                        }
                                                                    </p>
                                                                </Link>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    chuyển hướng tới kênh{" "}
                                                                    {
                                                                        channelData
                                                                            .name
                                                                    }
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    <p>
                                                        {channelData.sub} Người
                                                        đăng ký
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex px-3 py-2 max-sm:w-full">
                                                <Subcribe />
                                            </div>
                                        </div>
                                        <div className="flex justify-around items-center gap-3">
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
                                                    <p>{streamData.like}</p>
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
                                            <div className="flex items-center justify-center h-fit p-3 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 border-[1px] rounded-full">
                                                <AiOutlineShareAlt />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* des */}
                                <div
                                    className={`rounded-xl p-3 my-4 flex flex-col gap-2 bg-slate-200 dark:bg-slate-900 ${fullscreen ? "px-3" : ""}`}
                                >
                                    <div className="flex gap-3">
                                        <p>{streamData.view} người đang xem</p>
                                        <p>
                                            {`Đã bắt đầu phát trực tiếp ${FormatDateTime(streamData.createdTime)}`}
                                        </p>
                                    </div>
                                    <p className="">{streamData.des}</p>
                                </div>
                            </div>
                            <div className='flex-1 px-3'>cái live chat này làm phát 1, nhma lưu chúng nó lại để sau khi stream xong vẫn xem được là 1 vấn đề lớn</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}





// export function Pagex({ videoData }: { videoData: BigVideoDataType }) {
//     const src = videoData.videoData.mediaType == 0 ? `${fileURL}/api/video/${videoData.videoData.link}` : `${fileURL}/api/merge/${videoData.videoData.link}/live`;



//     const { toast } = useToast();

//     const [volume, setVolume] = useLocalStorage("volume", 100);

//     const [currentTime, setCurrentTime] = useState<number>(0);
//     const [loadedProgress, setLoadedProgress] = useState<number>(0);
//     const [speed, setSpeed] = useState<number>(1);
//     const [quality, setQuality] = useState<quality>({
//         current: 0,
//         available: [],
//     });

//     const [commentData, setCommentData] = useState<CommentDataType[]>();


//     const { data: session, status } = useSession();
//     const [like, setLike] = useState<boolean>(false);
//     const [dislike, setDislike] = useState<boolean>(false);
//     const [hide, setHide] = useState<boolean>(false);

//     const [subcribe, setSubcribe] = useState<SubcribeType>();



//     const loadVideo = async () => {
//         const video = document.getElementById("video") as HTMLVideoElement;
//         var hls = new Hls({ startPosition: currentTime });
//         hls.on(Hls.Events.MEDIA_ATTACHED, function () {
//             console.log("video and hls.js are now bound together !");
//         });
//         hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
//             setQuality((prev) => {
//                 return {
//                     current: prev.current,
//                     available: data.levels.map((e) => e.height),
//                 };
//             });
//             hls.loadLevel = quality.current;
//             setLoadedContent(true);
//         });

//         hls.on(Hls.Events.FRAG_LOADED, function (event, data) {
//             // @ts-ignore
//             const totalChunks = hls.media.duration;
//             // @ts-ignore
//             const loadedChunks = hls.buffered.end(0);
//             const progress = (loadedChunks / totalChunks) * 100;
//             setLoadedProgress(progress);
//         });

//         hls.loadSource(src);
//         hls.attachMedia(video);
//     };

//     useEffect(() => {
//         loadVideo();
//     }, [src, quality.current]);

//     useEffect(() => {
//         if (ref.current) {
//             if (ref.current?.currentTime == ref.current?.duration) {
//                 axios.post("/api/video/updateview", {
//                     videoId: videoData.videoData.id,
//                 });
//             }
//         }
//     }, [ref.current?.currentTime]);

//     useEffectOnce(() => {
//         axios
//             .get("/api/comments/data", {
//                 params: {
//                     videoId: videoData.videoData.id,
//                 },
//             })
//             .then((res) => {
//                 setCommentData(res.data);
//             });
//     });



//     useEffect(() => {
//         const video = ref.current;
//         if (video) {
//             video.playbackRate = speed;
//         }
//     }, [speed]);

//     useEffect(() => {
//         const video = ref.current;
//         if (video) {
//             video.volume = volume / 100;
//         }
//     }, [volume]);

//     useEffectOnce(() => {
//         window.addEventListener("keydown", (e: KeyboardEvent) => {
//             if (e.code === "Space") {
//                 e.preventDefault();
//                 handlePlayPause();
//             }
//             if (e.code === "Escape") {
//                 e.preventDefault();
//                 setFullscreen(false);
//             }
//         });

//         return window.removeEventListener("keydown", (e: KeyboardEvent) => {
//             if (e.code === "Space") {
//                 e.preventDefault();
//                 handlePlayPause();
//             }
//             if (e.code === "Escape") {
//                 e.preventDefault();
//                 setFullscreen(false);
//             }
//         });
//     });

//     // useEffect(() => {
//     //     const channelAvatarStorageRef = fireRef(
//     //         storage,
//     //         `/channel/avatars/${videoData.channelData.tagName}`
//     //     );
//     //     getDownloadURL(channelAvatarStorageRef).then((url) =>
//     //         setChannelAvatar(url)
//     //     );
//     //     if (session) {
//     //         try {
//     //             const currentAccountStorageRef = fireRef(
//     //                 storage,
//     //                 //@ts-ignore
//     //                 `/accounts/${session?.user.id}`
//     //             );
//     //             getDownloadURL(currentAccountStorageRef).then((url) =>
//     //                 setCurrentAccountAvatar(url)
//     //             );
//     //         } catch (error) {}
//     //     }
//     // }, [""]);



//     useEffect(() => {
//         const handleMouseMove = (e: MouseEvent) => {
//             clearTimeout(timer);
//             setHide(false);
//             timer = setTimeout(() => {
//                 setHide(true);
//             }, 2000);
//         };

//         const handleMouseLeave = () => {
//             clearTimeout(timer);
//             setHide(true);
//         };

//         anyRef.current?.addEventListener("mousemove", handleMouseMove);
//         anyRef.current?.addEventListener("mouseout", handleMouseLeave);

//         return () => {
//             anyRef.current?.removeEventListener("mousemove", handleMouseMove);
//             anyRef.current?.removeEventListener("mouseleave", handleMouseLeave);
//         };
//     }, [""]);

//     const VolumeIcon = () => {
//         if (volume == 0) {
//             return <ImVolumeMute2 />;
//         } else if (volume > 75) {
//             return <ImVolumeHigh />;
//         } else if (volume > 50) {
//             return <ImVolumeMedium />;
//         } else if (volume > 25) {
//             return <ImVolumeLow />;
//         } else {
//             return <ImVolumeMute />;
//         }
//     };

//     const onTimeUpdate = (e: any) => {
//         const video = e.target;
//         setCurrentTime(video.currentTime);
//     };

//     const onProgress = (e: any) => {
//         const video = e.target;
//         if (video.buffered.length > 0) {
//             const loadedChunks = video.buffered.end(0);
//             const totalChunks = video.duration;
//             const progress = (loadedChunks / totalChunks) * 100;
//             setLoadedProgress(progress);
//         }
//     };

//     const onTimelineClick = (e: any) => {
//         const timeline = document.getElementById("timeline");
//         const video = ref.current;
//         if (timeline && video) {
//             const rect = timeline.getBoundingClientRect();
//             const offsetX = e.clientX - rect.left;
//             const timelineWidth = rect.width;
//             const newPosition = (offsetX / timelineWidth) * video.duration;
//             video.currentTime = newPosition;
//         }
//     };

//     const handlePlayPause = () => {
//         const video = ref.current;
//         if (video) {
//             if (video.paused) {
//                 video.play();
//             } else {
//                 video.pause();
//             }
//         }
//     };

//     const handleFullscreen = () => {
//         setFullscreen((prev) => !prev);
//     };

//     const items: MenuProps["items"] = [
//         {
//             key: "1",
//             type: "group",
//             label: "Chất lượng",
//             children: quality.available.map((q, index) => {
//                 return {
//                     key: `1-${index}`,
//                     label: q,
//                     onClick: () => {
//                         setQuality((prev) => {
//                             return {
//                                 current: index,
//                                 available: prev.available,
//                             };
//                         });
//                     },
//                 };
//             }),
//         },
//         {
//             key: "2",
//             label: "Tốc độ phát",
//             children: [
//                 {
//                     key: "2-1",
//                     label: "0.5x",
//                     onClick: () => {
//                         setSpeed(0.5);
//                     },
//                 },
//                 {
//                     key: "2-2",
//                     label: "1x",
//                     onClick: () => {
//                         setSpeed(1);
//                     },
//                 },
//                 {
//                     key: "2-3",
//                     label: "1.5x",
//                     onClick: () => {
//                         setSpeed(1.5);
//                     },
//                 },
//                 {
//                     key: "2-4",
//                     label: "2x",
//                     onClick: () => {
//                         setSpeed(2);
//                     },
//                 },
//             ],
//         },
//     ];





//     const handleSubmitComment = (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (session && session.user) {
//             axios
//                 .post("/api/comments/create", {
//                     videoId: videoData.videoData.id,
//                     //@ts-ignore
//                     accountId: session.user.id,
//                     content: commentInputRef.current?.value,
//                 })
//                 .then((res) => {
//                     commentInputRef.current!.value = "";
//                     setCommentData(res.data);
//                 });
//         } else {
//             toast({
//                 title: "chưa thể đăng bình luận",
//                 content: "bạn chưa đăng nhập",
//             });
//         }
//     };

//     const CommentRender = () => {
//         if (commentData == undefined) {
//             return (
//                 <div className="flex justify-center py-3 gap-3">
//                     <Skeleton className="w-[45px] h-[45px] rounded-full" />
//                     <div className="flex flex-1 flex-col gap-2">
//                         <Skeleton className="w-16 h-full rounded-lg" />
//                         <Skeleton className="w-full h-full rounded-lg" />
//                         <Skeleton className="w-10 h-full rounded-lg" />
//                     </div>
//                 </div>
//             )
//         } else if (commentData.length == 0) {
//             return (
//                 <div className="flex justify-center py-3">
//                     <p>video này chưa có bình luận nào</p>
//                 </div>
//             )
//         } else {
//             return (
//                 commentData.map((cmt, index) => {
//                     return <CommentItem key={index} cmt={cmt} />;
//                 })
//             )


//         }

//     };



//     const HandleCurrentAccountAvatarRender = () => {
//         if (status === "loading") {
//             return (
//                 <Skeleton className="w-full h-full rounded-full" />
//             )
//         } else if (status == "authenticated") {
//             return (
//                 <Image
//                     alt=""
//                     className="my-auto bg-transparent rounded-full"
//                     src={session.user.image}
//                     sizes="1/1"
//                     fill
//                 />
//             )
//         } else {
//             return (
//                 <Image
//                     alt=""
//                     className="my-auto rounded-full bg-transparent animate-spin"
//                     src={
//                         "https://danviet.mediacdn.vn/upload/2-2019/images/2019-04-02/Vi-sao-Kha-Banh-tro-thanh-hien-tuong-dinh-dam-tren-mang-xa-hoi-khabanh-1554192528-width660height597.jpg"
//                     }
//                     fill
//                     sizes="1/1"
//                 />
//             )
//         }
//     }

//     return (

//                                                 );
// }

// const VideoSuggest = ({
//     videoId,
//     channelData,
// }: {
//     videoId: number;
//     channelData: ChannelDataType;
// }) => {
//     const [tab, setTab] = useState<number>(0);

//     const listItem = [
//         {
//             id: 0,
//             name: "Tất cả",
//         },
//         {
//             id: 1,
//             name: `Của ${channelData.name}`,
//         },
//     ];
//     const [allVideo, setAllVideo] = useState<VideoWithoutComment[]>();
//     const [thisChannelVideo, setThisChannelVideo] = useState<MediaDataType[]>();

//     useEffectOnce(() => {
//         const allVideoFetch = axios
//             .get("/api/video/channel/except", {
//                 params: {
//                     videoId: videoId,
//                     channelId: channelData.id,
//                 },
//             })
//             .then((res) => {
//                 setThisChannelVideo(res.data);
//             });

//         const thisChannelVideoFetch = axios
//             .get("/api/video/all/except", {
//                 params: {
//                     videoId: videoId,
//                 },
//             })
//             .then((res) => {
//                 setAllVideo(res.data);
//             });

//         Promise.all([allVideoFetch, thisChannelVideoFetch])
//     });


//     const RenderAllVideo = () => {
//         if (allVideo) {
//             return allVideo.map((video, index) => {
//                 return <VideoItem key={index} videoData={video.videoData} channelData={video.channelData} />;
//             })
//         } else {
//             return <div className="flex flex-col items-center h-fit w-full p-3">
//                 <div className="relative w-full h-fit pt-[56.25%] rounded-md bg-transparent">
//                     <Skeleton className="absolute w-full h-full rounded-md" />
//                 </div>
//                 <div className="flex w-full gap-3 pt-1">
//                     <Skeleton className="w-[30px] h-[30px] rounded-full" />
//                     <div className="w-[calc(100%-30px)] flex flex-col">
//                         <Skeleton className="w-full h-[20px] rounded-lg" />

//                         <Skeleton className="w-12 h-[26px] rounded-lg" />
//                         <Skeleton className="w-12 h-[18px] rounded-lg" />
//                     </div>
//                 </div>
//             </div>
//         }
//     }

//     return (
//         <div className="flex flex-col w-full">
//             <div className="flex gap-3">
//                 {listItem.map((button, index) => {
//                     return (
//                         <div
//                             key={index}
//                             onClick={() => {
//                                 setTab(button.id);
//                             }}
//                             className={`px-3 py-2 cursor-pointer rounded-xl bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-700 ${tab === button.id
//                                 ? "shadow-[0_0_20px_purple_inset]"
//                                 : ""
//                                 }`}
//                         >
//                             {button.name}
//                         </div>
//                     );
//                 })}
//             </div>
//             <div className="">
//                 <div className={`${tab == 0 ? '' : 'hidden'} flex flex-col gap-3 pt-2 overflow-y-scroll hidden-scrollbar pr-3`}>
//                     <RenderAllVideo />
//                 </div>
//                 <div className={`${tab == 1 ? '' : 'hidden'} flex flex-col gap-3 pt-2 overflow-y-scroll hidden-scrollbar pr-3`}>
//                     {thisChannelVideo?.map((video, index) => {
//                         return (
//                             <ThisChannelVideoItem
//                                 key={index}
//                                 videoData={video}
//                             />
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     );
// };
