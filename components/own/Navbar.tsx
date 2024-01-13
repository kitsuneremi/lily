"use client";
import { useMediaQuery, useEffectOnce } from "usehooks-ts";
import React, { useState } from "react";
import { BsChatLeftDots } from "react-icons/bs";
import {
    AiOutlineClose,
    AiOutlineRight,
    AiOutlineLeft,
    AiOutlineUpload,
    AiOutlineSearch,
} from "react-icons/ai";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { useSsr } from "usehooks-ts";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/storage";
import { close, reverse, open } from "@/redux/features/sidebar-slice";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Notification = dynamic(() => import("@/components/own/navbar/Notification"));
const SearchModule = dynamic(() => import("@/components/own/navbar/SearchModule"));
const LastMenu = dynamic(() => import("@/components/own/navbar/LastMenu"));


export default function Navbar() {
    const { isBrowser } = useSsr();
    
    const dispatch = useDispatch();

    const openSidebar = useAppSelector(
        (state) => state.sidebarReducer.value.sidebar
    );

    const [mobileShowSearch, setMobileShowSearch] = useState<boolean>();

    const deviceType = {
        isPc: useMediaQuery("(min-width: 1280px"),
        isTablet: useMediaQuery("(min-width:700px) and (max-width: 1279px)"),
        isMobile: useMediaQuery("(max-width: 699px)"),
    };

    useEffectOnce(() => {
        dispatch(close());
        setMobileShowSearch(false);
    });

    
    if (isBrowser) {
        if (deviceType.isMobile) {
            return (
                <>
                    {mobileShowSearch ? <div className="flex w-40 gap-8 text-xl items-center">
                        <div onClick={() => {
                            dispatch(reverse());
                        }}>
                            {openSidebar ? (
                                <AiOutlineRight />
                            ) : (
                                <AiOutlineLeft />
                            )}
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <MenuRender />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Quay về trang chủ</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                        :
                        <>
                            <button className="text-xl ml-3">
                                <AiOutlineClose
                                    onClick={() => {
                                        setMobileShowSearch(false);
                                    }}
                                />
                            </button>
                            <SearchModule />
                        </>

                    }


                    <div className="flex gap-3 items-center">
                        {!mobileShowSearch && <div
                            className="lg:hidden"
                            onClick={() => {
                                setMobileShowSearch(true);
                            }}
                        >
                            <AiOutlineSearch />
                        </div>}
                        <AiOutlineUpload />
                        <Notification />
                        <BsChatLeftDots />
                        <LastMenu />
                    </div>
                </>
            )
        } else {
            return (
                // device type: desktop hoặc tablet
                <>
                    <div className="w-40 flex gap-8 select-none">
                        <div
                            className="text-xl flex items-center cursor-pointer"
                            onClick={() => {
                                dispatch(reverse());
                            }}
                        >
                            {openSidebar ? (
                                <AiOutlineRight />
                            ) : (
                                <AiOutlineLeft />
                            )}
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Link
                                        href={"/"}
                                        className="text-xl flex items-center gap-2"
                                    >
                                        <div className="relative w-5 h-5 lg:w-9 lg:h-9">
                                            <Image
                                                className="rounded-full animate-spin"
                                                src={
                                                    "https://danviet.mediacdn.vn/upload/2-2019/images/2019-04-02/Vi-sao-Kha-Banh-tro-thanh-hien-tuong-dinh-dam-tren-mang-xa-hoi-khabanh-1554192528-width660height597.jpg"
                                                }
                                                fill
                                                sizes="1/1"
                                                alt="khá bảnh"
                                            />
                                        </div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Quay về trang chủ</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <SearchModule />
                    <div className="flex gap-3 items-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="flex items-center">
                                            <div className="text-2xl cursor-pointer flex items-center">
                                                <AiOutlineUpload />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>
                                                Loại nội dung đăng tải
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <Link
                                                    href={
                                                        "/station/upload/video"
                                                    }
                                                    className="w-full"
                                                >
                                                    Video
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Link
                                                    href={
                                                        "/station/upload/livestream"
                                                    }
                                                    className="w-full"
                                                >
                                                    Sự kiện trực tiếp
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Đăng tải nội dung</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Notification />
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="text-2xl cursor-pointer">
                                        <BsChatLeftDots />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        Trò chuyện (đã có nhưng chưa cho vào
                                        chạy)
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <LastMenu />
                    </div>
                </>
            );
        }
    }
}

const MenuRender = () => {
    return (
        <Link href={"/"} className="text-xl flex items-center gap-2" >
            <div className="relative w-5 h-5 lg:w-9 lg:h-9">
                <Image
                    className="rounded-full animate-spin"
                    src={
                        "https://danviet.mediacdn.vn/upload/2-2019/images/2019-04-02/Vi-sao-Kha-Banh-tro-thanh-hien-tuong-dinh-dam-tren-mang-xa-hoi-khabanh-1554192528-width660height597.jpg"
                    }
                    fill
                    sizes="1/1"
                    alt="khá bảnh"
                />
            </div>
        </Link >
    );
}




