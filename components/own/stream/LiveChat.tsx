"use client";
import { ChannelDataType, MediaDataType } from "@/types/type";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef, useState, useEffect } from "react";
import { useEffectOnce } from "usehooks-ts";
import io from "socket.io-client";
import { Session } from "next-auth";
import axios from "axios";

type Message = {
    accountId: number;
    name: string;
    image: string;
    content: string;
    room: number;
};

const socket = io("http://localhost:6074").connect();

export default function LiveChat({
    channelData,
    session,
    streamData,
}: {
    channelData: ChannelDataType;
    session: Session | null;
    streamData: MediaDataType;
}) {
    const [commentValue, setCommentValue] = useState<string>("");
    const [list, setList] = useState<Message[]>([]);

    useEffect(() => {
        axios
            .get("/api/live/chat", {
                params: {
                    id: streamData.id,
                },
            })
            .then((res) => setList(res.data));
    }, [streamData]);

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
        if (session) {
            socket.emit("join", {
                id: session.user.id,
                room: streamData.id,
            });
        }
    }, [session]);

    const sendComment = () => {
        if (session && session.user) {
            const data = {
                accountId: session.user.id,
                name: session.user.name,
                image: session.user.image,
                content: commentValue,
                room: streamData.id,
            };
            socket.emit("sendmsg", data);
            setList((prev) => [...prev, data]);
            setCommentValue("");
        }
    };

    return (
        <div className="rounded-lg w-full shadow-[0_0_1px_4px_purple] flex flex-col">
            <div className="bg-slate-700 px-3 py-1 rounded-t-lg text-sm">
                Trò chuyện trực tiếp
            </div>
            {/* render the chat */}
            <div className="w-full flex-1 min-h-[400px] h-[600px] overflow-y-scroll">
                {list.map((item, index) => {
                    return (
                        <div key={index} className={`flex gap-2 p-2`}>
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
                                        item.accountId == channelData.id
                                            ? "rounded-md bg-yellow-400 text-black font-semibold"
                                            : ""
                                    }`}
                                >
                                    {item.name}
                                </div>
                                <div className="text-base">{item.content}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* comment post */}
            <div className="flex flex-col bg-slate-800 p-2 gap-2 rounded-b-lg">
                <div className="flex gap-2">
                    <div className="h-full flex items-center">
                        <div className="w-7 h-7 relative">
                            {session && session.user ? (
                                <Image
                                    src={session.user.image}
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
                        {session?.user ? (
                            <div className="w-fit px-2 rounded-lg">
                                <p className="text-sm">{session.user.name}</p>
                            </div>
                        ) : (
                            <Skeleton className="w-16 h-4 " />
                        )}

                        <input
                            value={commentValue}
                            onChange={(e) => {
                                setCommentValue(e.target.value);
                            }}
                            placeholder="bình luận"
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
    );
}
