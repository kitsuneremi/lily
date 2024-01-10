"use client";
import { useMediaQuery, useOnClickOutside, useEffectOnce } from "usehooks-ts";
import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import { BsBell, BsChatLeftDots } from "react-icons/bs";
import {
    AiOutlineClose,
    AiOutlineRight,
    AiOutlineLeft,
    AiOutlineUpload,
    AiOutlineSearch,
} from "react-icons/ai";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

import axios from "axios";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { useSsr } from "usehooks-ts";
import dynamic from "next/dynamic";
import { redirect, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
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
import MenuItem from '@/components/own/navbar/MenuItem'
import ModeSetting from "@/components/own/navbar/ModeSetting";
const Notification = dynamic(() => import("@/components/own/navbar/Notification"));
const SearchModule = dynamic(() => import("@/components/own/navbar/SearchModule"));
const ChannelRender = dynamic(() => import("@/components/own/navbar/CheckChannel"));



export default function Navbar() {
    const { data: session, status } = useSession();
    const { setTheme } = useTheme();
    const { isBrowser } = useSsr();
    const router = useRouter();
    const dispatch = useDispatch();

    const openSidebar = useAppSelector(
        (state) => state.sidebarReducer.value.sidebar
    );

    const popoverTriggerRef = useRef<HTMLDivElement>(null);
    const popoverContentRef = useRef<HTMLDivElement>(null);


    const [mobileShowSearch, setMobileShowSearch] = useState<boolean>();
    const [showPopover, setShowPopover] = useState<{
        click: boolean;
        menuFocus: boolean;
    }>({ click: false, menuFocus: false });

    const deviceType = {
        isPc: useMediaQuery("(min-width: 1280px"),
        isTablet: useMediaQuery("(min-width:700px) and (max-width: 1279px)"),
        isMobile: useMediaQuery("(max-width: 699px)"),
    };

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

    useEffectOnce(() => {
        dispatch(close());
        setMobileShowSearch(false);
    });

    const AccountAvatarRender = useCallback(() => {
        if (status == "loading") {
            return <Skeleton className="h-full w-full rounded-full" />;
        } else if (session && session.user.image != "") {
            return (
                <Image
                    src={session.user.image}
                    className="rounded-full"
                    fill
                    sizes="1/1"
                    alt=""
                />
            );
        } else {
            return (
                <Image
                    src={
                        "https://danviet.mediacdn.vn/upload/2-2019/images/2019-04-02/Vi-sao-Kha-Banh-tro-thanh-hien-tuong-dinh-dam-tren-mang-xa-hoi-khabanh-1554192528-width660height597.jpg"
                    }
                    className="rounded-full animate-spin"
                    fill
                    sizes="1/1"
                    alt=""
                />
            );
        }
    }, [session]);



    const DropMenu = useCallback(() => {
        return (
            <>
                <div className="relative">
                    <div
                        className="w-6 h-6 lg:w-8 lg:h-8 relative shadow-sm"
                        onClick={() => {
                            setShowPopover((prev) => {
                                return { click: !prev.click, menuFocus: false };
                            });
                        }}
                        ref={popoverTriggerRef}
                    >
                        <AccountAvatarRender />
                    </div>
                    {(showPopover.click || showPopover.menuFocus) && (
                        <div
                            className="absolute w-max top-9 right-0 h-fit"
                            ref={popoverContentRef}
                            onClick={() => {
                                setShowPopover({
                                    click: false,
                                    menuFocus: true,
                                });
                            }}
                        >
                            {session?.user ? (
                                <div className="shadow-[0_0_5px_purple] p-3 bg-white dark:bg-[#020817]">
                                    <ChannelRender />
                                    <MenuItem className="text-start">
                                        <div
                                            onClick={() => {
                                                signOut({
                                                    redirect: true,
                                                    callbackUrl: "/register",
                                                });
                                            }}
                                        >
                                            Đăng xuất
                                        </div>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            router.push("setting/account");
                                        }}
                                    >
                                        Cài đặt
                                    </MenuItem>
                                    <ModeSetting />
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2 shadow-[0_0_5px_purple] p-3 rounded-lg bg-white dark:bg-[#020817]">
                                    <MenuItem className="bg-gradient-to-r from-cyan-200 to-cyan-400 dark:from-cyan-400 dark:to-cyan-200 dark:hover:from-cyan-600 dark:hover:to-cyan-300 hover:bg-gradient-to-l hover:from-cyan-300 hover:to-cyan-600">
                                        <Link href={"/register"}>
                                            Đăng nhập
                                        </Link>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            router.push("setting/account");
                                        }}
                                    >
                                        Cài đặt
                                    </MenuItem>
                                    <ModeSetting />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </>
        );
    }, [showPopover]);

    if (isBrowser) {
        if (deviceType.isMobile) {
            if (mobileShowSearch) {
                //device type: mobile, trạng thái: show search input
                return (
                    <>
                        <button className="text-xl ml-3">
                            <AiOutlineClose
                                onClick={() => {
                                    setMobileShowSearch(false);
                                }}
                            />
                        </button>

                        <SearchModule />

                        <div className="flex gap-3 items-center">
                            <AiOutlineUpload />
                            <BsBell />
                            <BsChatLeftDots />
                            <DropMenu />
                        </div>
                    </>
                );
            } else if (mobileShowSearch == false) {
                // device type: mobile, trạng thái: ẩn search input
                return (
                    <>
                        <div className="flex w-40 gap-8 text-xl items-center">
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
                        <div className="flex gap-3 items-center">
                            <div
                                className="lg:hidden"
                                onClick={() => {
                                    setMobileShowSearch(true);
                                }}
                            >
                                <AiOutlineSearch />
                            </div>
                            <AiOutlineUpload />
                            <Notification />
                            <BsChatLeftDots />
                            <DropMenu />
                        </div>
                    </>
                );
            }
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
                        <DropMenu />
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




