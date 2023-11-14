"use client";
import LivePlayer from "@/components/own/stream/page";
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
import dynamic from "next/dynamic";
import LiveChat from "@/components/own/stream/LiveChat";
// const LiveChat = dynamic(() => import('@/components/own/stream/LiveChat'),{
//     loading: () => <p>loading...</p>,
//     ssr: true
// })

export default function Page({
  streamData,
  channelData,
}: {
  streamData: MediaDataType;
  channelData: ChannelDataType;
}) {
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
                  <p className="my-auto max-sm:w-full">Đã đăng ký</p>
                  <div className="flex flex-col justify-center">
                    <AiOutlineDown />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="p-2 rounded-lg select-none">
                  <DropdownMenuLabel>Nhận thông báo</DropdownMenuLabel>
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
            className={`relative ${
              fullscreen ? "mt-0" : "mt-3"
            } gap-10 h-full w-full overflow-y-scroll`}
          >
            <div className="lg:flex">
              <div
                ref={fullRef}
                className={`flex group flex-col w-full  ${
                  fullscreen
                    ? "absolute w-screen top-0 left-0 bg-white dark:bg-slate-600 overflow-y-scroll p-0 hidden-scrollbar"
                    : `relative lg:w-3/4 lg:px-10 max-sm:px-2 px-5`
                }`}
              >
                <div
                  ref={anyRef}
                  className={`flex justify-center relative ${
                    loadedContent ? "" : "pt-[56.25%] max-h-[80vh]"
                  } ${fullscreen ? "w-full h-screen" : ""} rounded-xl`}
                >
                  <LivePlayer
                    name={channelData.tagName}
                    streamData={streamData}
                  />
                </div>

                {/* video property */}
                <div className={`max-sm:px-2 mt-2 ${fullscreen ? "px-3" : ""}`}>
                  <p className="text-3xl font-bold my-3">{streamData.title}</p>
                  <div className="flex justify-between max-sm:flex-col">
                    <div className="flex gap-2 max-sm:flex-col">
                      <div className="flex gap-3">
                        <div className="flex flex-col justify-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Link href={`/channel/${channelData.tagName}`}>
                                  <div className="relative lg:w-[55px] lg:h-[55px] max-sm:w-[45px] max-sm:h-[45px] w-[40px] h-[40px]">
                                    {channelData.avatarImage && (
                                      <Image
                                        src={channelData.avatarImage}
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
                                <p>chuyển hướng tới kênh {channelData.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex flex-col gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Link href={`/channel/${channelData.tagName}`}>
                                  <p className="text-xl font-semibold text-start">
                                    {channelData.name}
                                  </p>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>chuyển hướng tới kênh {channelData.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <p>{channelData.sub} Người đăng ký</p>
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
                            {like ? <AiFillLike /> : <AiOutlineLike />}
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
                          {dislike ? <AiFillDislike /> : <AiOutlineDislike />}
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
                  className={`rounded-xl p-3 my-4 flex flex-col gap-2 bg-slate-200 dark:bg-slate-900 ${
                    fullscreen ? "px-3" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <p>{streamData.view} người đang xem</p>
                    <p>
                      {`Đã bắt đầu phát trực tiếp ${FormatDateTime(
                        streamData.createdTime
                      )}`}
                    </p>
                  </div>
                  <p className="">{streamData.des}</p>
                </div>
              </div>
              <div className="flex-1 px-3">
                <LiveChat channelData={channelData} session={session} streamData={streamData}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 