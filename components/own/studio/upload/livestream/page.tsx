"use client";
import VideoJS from "@/components/own/test/VIdeojs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { baseURL } from "@/lib/functional";
import { ChannelDataType, MediaDataType } from "@/types/type";
import axios from "axios";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useCopyToClipboard, useEffectOnce } from "usehooks-ts";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import io from "socket.io-client";

type Message = {
    accountId: number;
    name: string;
    image: string;
    content: string;
    room: number;
};

const socket = io("http://localhost:6074").connect();

export default function Page({
    session,
    channelData,
}: {
    session: Session;
    channelData: ChannelDataType;
}) {
    const [value, copy] = useCopyToClipboard();
    const [title, setTitle] = useState<string>("");
    const [des, setDes] = useState<string>("");
    const [mode, setMode] = useState<number>(0);

    const [tab, setTab] = useState<number>(0);
    const [streamData, setStreamData] = useState<MediaDataType | null>();
    const [isLive, setIsLive] = useState<boolean>(
        channelData.live ? true : false
    );

    const [commentValue, setCommentValue] = useState<string>("");
    const [list, setList] = useState<Message[]>([]);

    const deviceType = {
        isFlex: useMediaQuery("(min-width: 1200px"),
        isAbsolute: useMediaQuery("(max-width: 1199px)"),
    };

    const { toast } = useToast();

    useEffectOnce(() => {
        const handleReceivedMessage = (data: Message) => {
            setList((prev) => [...prev, data]);
        };

        socket.on("rcvmsg", handleReceivedMessage);

        return () => {
            socket.off("rcvmsg", handleReceivedMessage);
        };
    });

    useEffect(() => {
        if (session && streamData) {
            socket.emit("join", {
                id: session.user.id,
                room: streamData.id,
            });
        }
    }, [session, streamData]);

    const sendComment = () => {
        if (session && session.user && isLive && streamData) {
            const data = {
                accountId: session.user.id,
                name: channelData.name,
                image: channelData.avatarImage || session.user.image,
                content: commentValue,
                room: streamData.id,
            };
            socket.emit("sendmsg", data);
            setList((prev) => [...prev, data]);
            setCommentValue('')
        }
    };

    useEffectOnce(() => {
        if (channelData) {
            setInterval(() => {
                axios
                    .get(`/api/live/data`, {
                        params: {
                            tag: channelData.tagName,
                        },
                    })
                    .then((res) => {
                        setStreamData(res.data);
                    })
                    .catch((err) => {
                        setStreamData(null);
                    });
            }, 5000);
        }
    });

    useEffectOnce(() => {
        setInterval(() => {
            axios
                .get("/api/channel/islive", {
                    params: {
                        accountId: session.user.id,
                    },
                })
                .then((res) => setIsLive(res.data));
        }, 5000);
    });

    useEffect(() => {
        console.log(streamData);
    }, [streamData]);

    const tabRender = () => {
        if (tab == 0) {
            return (
                <div className="grid grid-cols-2">
                    <div className="flex flex-col p-4 gap-3">
                        <p className="text-lg">Mã sự kiện trực tiếp</p>
                        <div className="">
                            <p>Chọn phương thức kết nối trực tiếp</p>
                            <Select defaultValue="0">
                                <SelectTrigger className="w-full bg-transparent">
                                    <SelectValue placeholder="RTMP" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem defaultChecked value="0">
                                        RTMP
                                    </SelectItem>
                                    <SelectItem value="1" disabled>
                                        HLS (đang phát triển){" "}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-4 items-center w-full justify-between">
                            <p className="relative w-full after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-slate-600">
                                {channelData
                                    ? `${channelData.tagName}?key=${channelData.streamKey}`
                                    : ""}
                            </p>
                            <div className="flex gap-2 flex-shrink-0">
                                <button className="px-3 py-1 my-1 border-slate-500 border-2">
                                    Đặt lại
                                </button>
                                <button
                                    className="px-3 py-1 my-1 border-slate-500 border-2"
                                    onClick={() => {
                                        channelData
                                            ? copy(
                                                  `${channelData.tagName}?key=${channelData.streamKey}`
                                              )
                                            : () => {};
                                    }}
                                >
                                    Sao chép
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <p>url máy chủ phát trực tiếp</p>
                            <div className="flex justify-between items-center gap-3">
                                <p className="relative w-full after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-slate-600">
                                    rtmp://erinasaiyukii.com/live
                                </p>
                                <button
                                    className="flex-shrink-0 px-3 py-1 my-1 border-slate-500 border-2"
                                    onClick={() => {
                                        copy("rtmp://erinasaiyukii.com/live");
                                    }}
                                >
                                    Sao chép
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 flex flex-col gap-4 flex-1">
                        <p>Cài đặt nâng cao</p>
                        <div className="flex flex-col w-full gap-3">
                            <div className="flex gap-3">
                                <label className="flex gap-2 text-lg">
                                    tiêu đề
                                </label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-transparent flex-1 border-b-2 focus:outline-none focus:border-cyan-200 border-b-slate-600"
                                    placeholder="tiêu đề"
                                />
                            </div>
                            <label className="flex gap-2 text-lg">mô tả</label>
                            <textarea
                                value={des}
                                onChange={(e) => setDes(e.target.value)}
                                className="resize-none h-24 overflow-hidden w-full bg-transparent border-b-2 focus:outline-none focus:border-cyan-200 border-b-slate-600"
                                placeholder="mô tả"
                            />
                            <div className="flex gap-3">
                                <label className="flex gap-2 text-lg">
                                    chế độ hiển thị
                                </label>
                                <Select
                                    onValueChange={(e) =>
                                        setMode(Number.parseInt(e))
                                    }
                                    defaultValue="0"
                                >
                                    <SelectTrigger className="w-[180px] bg-transparent">
                                        <SelectValue placeholder="Công khai" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem defaultChecked value="0">
                                            Công khai
                                        </SelectItem>
                                        <SelectItem value="1">
                                            Không công khai
                                        </SelectItem>
                                        <SelectItem value="2">
                                            Riêng tư
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (tab == 1) {
        } else if (tab == 2) {
        }
    };

    const handlePostStream = () => {
        if (!streamData) {
            axios
                .post("/api/live/create", {
                    title: title,
                    des: des,
                    status: mode,
                    accountId: session.user.id,
                })
                .then((res) => {
                    if (res.status == 201) {
                        toast({
                            title: "ok",
                            description:
                                "bạn đã tạo buổi phát trực tiếp thành công",
                        });
                    } else {
                        toast({
                            title: "phát luồng trước đã",
                            description: "chưa tìm thấy luồng phát",
                        });
                    }
                });
        }
    };

    const handleUpdateStreamData = () => {
        if (streamData) {
            axios
                .post("/api/live/update", {
                    id: streamData.id,
                    title: title,
                    des: des,
                    status: mode,
                    accountId: session.user.id,
                })
                .then((res) => {
                    if (res.status == 200) {
                        toast({
                            title: "cập nhật thành công",
                            description:
                                "cập nhật dữ liệu luồng phát thành công",
                        });
                    } else {
                        toast({
                            title: "phát luồng trước đã",
                            description: "chưa tìm thấy luồng phát",
                        });
                    }
                });
        }
    };

    const handleStreamButton = () => {
        if (channelData) {
            if (isLive && streamData) {
                if (streamData.isLive) {
                    return (
                        <div className="flex gap-2">
                            <button
                                className="px-3 py-2 bg-cyan-600"
                                onClick={() => {
                                    handleUpdateStreamData();
                                }}
                            >
                                Cập nhật
                            </button>
                            <button className="px-3 py-2 bg-red-600 text-white">
                                Dừng sự kiện trực tiếp
                            </button>
                        </div>
                    );
                } else {
                    return (
                        <Link href={`/watch/${streamData?.link}`}>xem lại</Link>
                    );
                }
            } else if (isLive && streamData === null) {
                return (
                    <button
                        className={`px-3 py-2 bg-cyan-400 flex-shrink-0`}
                        onClick={() => {
                            handlePostStream();
                        }}
                    >
                        Phát trực tiếp
                    </button>
                );
            } else if (!isLive) {
                return (
                    <button
                        className={`px-3 py-2 bg-slate-500 flex-shrink-0`}
                        onClick={() => {
                            handlePostStream();
                        }}
                    >
                        Phát trực tiếp
                    </button>
                );
            }
        }
    };

    if (deviceType.isAbsolute || deviceType.isFlex) {
        return (
            <div className={`flex w-full`}>
                {/* config */}
                <div className="p-3 flex flex-col gap-3 bg-[#161616] w-3/4">
                    <div className="flex flex-col bg-[#1f1f1f] p-4">
                        <div className="flex">
                            <div className="p-3">
                                {channelData ? (
                                    <VideoJS name={channelData.tagName} />
                                ) : (
                                    <div className="w-96 pt-[56.25%]"></div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 w-max p-3 gap-3">
                                <p>tiêu đề</p>
                                <p>{streamData?.title}</p>

                                <p>Mô tả</p>
                                <p>{streamData?.des}</p>

                                <p>trạng thái</p>
                                <p>
                                    {streamData?.status == 0
                                        ? "công khai"
                                        : streamData?.status == 1
                                        ? "không công khai"
                                        : "riêng tư"}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            {channelData ? (
                                isLive ? (
                                    <p>
                                        tính năng tắt phát trực tiếp tạm thời
                                        chưa có, tắt ở obs đi
                                    </p>
                                ) : (
                                    <p>
                                        Để phát trực tiếp, hãy gửi video của bạn
                                        đến FakeTube bằng phần mềm phát trực
                                        tiếp như obs, streamlab,...
                                    </p>
                                )
                            ) : (
                                <></>
                            )}
                            {handleStreamButton()}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex bg-[#282828]">
                            <button
                                onClick={() => {
                                    setTab(0);
                                }}
                                className={`px-3 py-2 hover:bg-slate-700 ${
                                    tab == 0
                                        ? "relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-slate-500"
                                        : ""
                                }`}
                            >
                                Cài đặt sự kiện trực tiếp
                            </button>
                            <button
                                onClick={() => {
                                    setTab(1);
                                }}
                                className={`px-3 py-2 hover:bg-slate-700 ${
                                    tab == 1
                                        ? "relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-slate-500"
                                        : ""
                                }`}
                            >
                                Số liệu phân tích
                            </button>
                            <button
                                onClick={() => {
                                    setTab(2);
                                }}
                                className={`px-3 py-2 hover:bg-slate-700 ${
                                    tab == 2
                                        ? "relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-slate-500"
                                        : ""
                                }`}
                            >
                                in progress
                            </button>
                        </div>
                        <div className="bg-[#1f1f1f]">{tabRender()}</div>
                    </div>
                </div>
                {/* realtime chat */}
                <div className="w-1/4 p-5">
                    <div className="rounded-lg w-full shadow-[0_0_1px_4px_purple] flex flex-col justify-between">
                        <div className="bg-slate-700 px-3 py-1 rounded-t-lg text-sm">
                            Trò chuyện trực tiếp
                        </div>
                        <div className="w-full flex-1 min-h-[400px] h-[600px] overflow-y-scroll">
                            {list.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`flex gap-2 p-2`}
                                    >
                                        <div className="w-8 h-full flex flex-col items-center">
                                            <div className="h-8 w-full relative">
                                                <Image
                                                    src={item.image}
                                                    fill
                                                    loading="lazy"
                                                    alt=""
                                                    className="rounded-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <div
                                                className={`text-sm m-0 px-2 py-1 ${
                                                    item.accountId ==
                                                    channelData.id
                                                        ? "rounded-md bg-yellow-400 text-black font-semibold"
                                                        : ""
                                                }`}
                                            >
                                                {item.name}
                                            </div>
                                            <div className="text-base">
                                                {item.content}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex flex-col bg-slate-800 p-2 gap-2 rounded-b-lg">
                            <div className="flex gap-2">
                                <div className="h-full flex items-center">
                                    <div className="w-7 h-7 relative">
                                        {channelData &&
                                        channelData.avatarImage ? (
                                            <Image
                                                src={channelData.avatarImage}
                                                alt=""
                                                fill
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <Skeleton className="rounded-full w-7 h-7" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col w-full gap-2">
                                    {channelData ? (
                                        <div className="w-fit px-2 rounded-lg text-black font-bold bg-yellow-200">
                                            <p className="text-sm">
                                                {channelData.name}
                                            </p>
                                        </div>
                                    ) : (
                                        <Skeleton className="w-16 h-4 " />
                                    )}
                                    <input
                                        value={commentValue}
                                        placeholder="bình luận"
                                        onChange={(e) => {
                                            setCommentValue(e.target.value);
                                        }}
                                        className="w-full text-sm border-t-0 border-x-0 bg-transparent border border-b-[1px] border-slate-500 focus:outline-none focus:border-b-slate-700"
                                    />
                                </div>
                            </div>
                            <div className="w-full flex justify-end">
                                <button
                                    className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
                                    onClick={sendComment}
                                >
                                    bình luận
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
