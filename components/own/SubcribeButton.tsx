import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCallback, useState, useEffect } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import { NotificationOutlined } from "@ant-design/icons";
import { AiOutlineDown } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";
import { Account, Subcribes } from "@/prisma/type";

export default function SubcribeButton({
    channelData
}: {
    channelData: Account;
}) {
    const { data: session, status: authenStatus } = useSession();
    const [subcribe, setSubcribe] = useState<Subcribes>();

    useEffect(() => {
        if (session && session.user) {
            if (session.user.id !== channelData.id) {
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
    }, [channelData.id, session]);

    const handleSubcribe = useCallback(() => {
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
    }, [channelData, session]);

    if (session && session.user) {
        if (session.user.id === channelData.id) {
            return (
                <div
                    className="px-4 py-2 h-fit text-lg font-semibold cursor-pointer rounded-[24px] border-[1px] bg-slate-50 border-slate-600 border-opacity-20 shadow-md hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800"
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
                            <div className="flex gap-2 px-4 py-2 rounded-[24px] border-[1px] border-slate-600 border-opacity-40 shadow-md hover:bg-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800">
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
                            className="flex gap-2 px-4 py-2 cursor-pointer rounded-[24px] border-[1px] border-slate-600 border-opacity-40 shadow-md hover:bg-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800"
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
    } else {
        return (
            <div
                className="flex gap-2 px-4 py-2 cursor-pointer rounded-[24px] border-[1px] border-slate-600 border-opacity-40 shadow-md hover:bg-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800"
                onClick={() => { redirect('/register') }}
            >
                <p className="my-auto max-sm:w-full">Đăng ký</p>
            </div>
        )
    }
}

