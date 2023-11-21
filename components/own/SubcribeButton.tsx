import { MediaDataType, SessionDataType, SubcribeType } from "@/types/type";
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

export default function Button({
    session,
    channelAccountId,
    channelId
}: {
    session: SessionDataType | null;
    channelAccountId: number;
    channelId: number
}) {
    const [subcribe, setSubcribe] = useState<SubcribeType>();

    useEffect(() => {
        if (session && session.user) {
            if (session.user.id !== channelAccountId) {
                axios
                    .get("/api/subcribe", {
                        params: {
                            targetChannel: channelId,
                            accountId: session.user.id,
                        },
                    })
                    .then((val) => {
                        setSubcribe(val.data);
                    });
            }
        }
    }, [session]);

    const handleSubcribe = useCallback(() => {
        if (session && session.user) {
            axios
                .post("/api/subcribe/addordelete", {
                    //@ts-ignore
                    accountId: session.user.id,
                    channelId: channelId,
                })
                .then((val) => {
                    setSubcribe(val.data);
                });
        } else {
            redirect("/register");
        }
    }, []);

    if (session && session.user) {
        if (session.user.id === channelAccountId) {
            return (
                <div
                    className="px-4 py-2 h-fit cursor-pointer rounded-[24px] border-[1px] hover:bg-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800"
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
}
