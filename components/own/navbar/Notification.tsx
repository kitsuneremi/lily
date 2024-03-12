"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOnClickOutside } from "usehooks-ts";
import { BsYoutube, BsBell, BsChatLeftDots } from "react-icons/bs";
import { MenuOutlined, SettingOutlined } from "@ant-design/icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NotificationType = {
    accountId: number;
    channelId: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    content: string;
};

export default function Notification() {
    const { data: session } = useSession();
    const [data, setData] = useState<NotificationType[]>();

    const popoverTriggerRef = useRef<HTMLDivElement>(null);
    const popoverContentRef = useRef<HTMLDivElement>(null);

    const [showPopover, setShowPopover] = useState<{
        click: boolean;
        menuFocus: boolean;
    }>({ click: false, menuFocus: false });

    useOnClickOutside(popoverTriggerRef, () => {
        setTimeout(
            () =>
                setShowPopover((prev) => {
                    return { click: false, menuFocus: prev.menuFocus };
                }),
            200
        );
    });
    useOnClickOutside(popoverContentRef, () => {
        setTimeout(
            () =>
                setShowPopover((prev) => {
                    return { click: prev.click, menuFocus: false };
                }),
            200
        );
    });

    useEffect(() => {
        if (session && session.user && session.user.id) {
            axios.get(`/api/notification?accountid=${session.user.id}`)
                .then((response) => {
                    setData(response.data);
                });
        }
    }, [session]);

    return (
        <div className="relative flex items-center">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <div
                            className="text-2xl lg:text-3xl flex items-center cursor-pointer"
                            ref={popoverTriggerRef}
                            onClick={() => {
                                setShowPopover((prev) => {
                                    return {
                                        click: !prev.click,
                                        menuFocus: false,
                                    };
                                });
                            }}
                        >
                            <BsBell />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Thông báo (đang phát triển)</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {(showPopover.click || showPopover.menuFocus) && (
                <div className="absolute w-max top-9 right-0 h-fit max-h-[70vh] overflow-y-auto lg:max-h-80 shadow-[0_0_10px_purple] min-w-[240px] p-3 bg-slate-200 dark:bg-slate-800">
                    <div className="pb-2 relative text-2xl mb-2 select-none after:absolute after:w-full after:h-[1px] after:bg-slate-500 after:bottom-0 after:left-0">
                        Thông báo
                    </div>
                    {data ? (
                        data.length > 0 ? (
                            data.map((item, index) => {
                                return (
                                    <div
                                        className="flex gap-3 justify-between h-max cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-500 p-2 rounded-md"
                                        key={index}
                                    >
                                        <div className="flex flex-col">
                                            <p className="font-bold">
                                                {item.title}
                                            </p>
                                            <p className="font-semibold text-sm">
                                                {item.content}
                                            </p>
                                            <p className="text-[10px] dark:text-cyan-400 text-amber-800">
                                                {item.createdAt.toString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <SettingOutlined />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>
                                                        Tùy chỉnh thông báo
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        Tắt thông báo từ kênh
                                                        này
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        Tắt thông báo kênh này
                                                        trong 24h
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <>không có thông báo nào</>
                        )
                    ) : (
                        <div>loading...</div>
                    )}
                </div>
            )}
        </div>
    );
}


{/* 

<span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
*/}