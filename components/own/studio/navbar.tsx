"use client";
import {
    AiOutlineMenu,
    AiOutlineUpload,
    AiOutlineSearch,
} from "react-icons/ai";
import { SiYoutube } from "react-icons/si";
import { useEffect, useRef, useState, useCallback } from "react";
import { BsSearch } from "react-icons/bs";
import { useOnClickOutside } from "usehooks-ts";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/storage";
import { reverse } from "@/redux/features/sidebar-slice";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BsBell, BsChatLeftDots } from "react-icons/bs";
import dynamic from "next/dynamic";
import { ChannelDataType } from "@/types/type";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
const Notification = dynamic(() => import("@/components/own/Notification"));

const StudioNavbar = () => {
    // ref
    const searchRef = useRef<HTMLInputElement>(null);
    const searchResultRef = useRef<HTMLDivElement>(null);
    const popoverTriggerRef = useRef<HTMLDivElement>(null);
    const popoverContentRef = useRef<HTMLDivElement>(null);

    // state
    const [searchValue, setSearchValue] = useState<string>("");
    const [focusing, setFocus] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [personalChannelData, setPersonalChannelData] = useState<ChannelDataType>();
    const [showPopover, setShowPopover] = useState<{
        click: boolean;
        menuFocus: boolean;
    }>({ click: false, menuFocus: false });

    const { data: session, status } = useSession();
    const { theme, setTheme } = useTheme();
    const dispatch = useDispatch();
    const router = useRouter();

    useOnClickOutside(searchResultRef, () => {
        if (!focusing) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    });

    useEffect(() => {
        setVisible(focusing);
    }, [focusing]);



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

    const Collapse = ({
        trigger,
        content,
    }: {
        trigger: React.ReactNode;
        content: React.ReactNode;
    }) => {
        return (
            <div className="flex flex-col gap-1 w-max group/box">
                <div>{trigger}</div>
                {
                    <div className="hidden group-hover/box:block hover:bg-transparent hover:block">
                        {content}
                    </div>
                }
            </div>
        );
    };

    const lightModeSetting = useCallback(() => {
        return (
            <Collapse
                trigger={
                    <MenuItem className="text-start">Chế độ sáng</MenuItem>
                }
                content={
                    <div className="flex flex-col w-full rounded-sm text-start">
                        <button
                            onClick={() => {
                                setTheme("light");
                            }}
                            className="text-start py-1 pl-5 hover:bg-slate-200 hover:text-slate-800 rounded-md"
                        >
                            Sáng
                        </button>
                        <button
                            onClick={() => {
                                setTheme("dark");
                            }}
                            className="text-start py-1 pl-5 hover:bg-slate-600 rounded-md hover:text-white"
                        >
                            Tối
                        </button>
                        <button
                            onClick={() => {
                                setTheme("system");
                            }}
                            className="text-start py-1 pl-5 hover:bg-gradient-to-r from-slate-200 to-slate-600 rounded-md hover:text-white"
                        >
                            Hệ thống
                        </button>
                    </div>
                }
            />
        );
    }, []);

    const ChannelRender = useCallback(() => {
        if (!session && personalChannelData == undefined) {
            return (
                <MenuItem className="text-start">
                    <Skeleton className="h-full w-full" />
                </MenuItem>
            );
        } else if (session && personalChannelData == null) {
            return (
                <MenuItem
                    onClick={() => {
                        router.push("regchannel");
                    }}
                >
                    Chưa có kênh? Tạo ngay!
                </MenuItem>
            );
        } else if (session && personalChannelData) {
            return (
                <>
                    <MenuItem className="bg-transparent">
                        <div className="flex gap-4">
                            <div className="flex items-center">
                                <div className="relative w-8 h-8">
                                    {personalChannelData.avatarImage && (
                                        <Image
                                            className="rounded-full"
                                            src={
                                                personalChannelData.avatarImage
                                            }
                                            alt=""
                                            fill
                                            sizes="1/1"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <p className="text-xl">{session.user.name}</p>
                            </div>
                        </div>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            router.push("station");
                        }}
                    >
                        Station
                    </MenuItem>
                </>
            );
        }
    }, [session, personalChannelData]);

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
                                    {lightModeSetting()}
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
                                    {lightModeSetting()}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </>
        );
    }, [showPopover]);

    return (
        <div className="flex justify-between px-3 h-16">
            <div className="flex gap-6 select-none">
                <div
                    className="flex items-center ml-2"
                    onClick={() => dispatch(reverse())}
                >
                    <AiOutlineMenu />
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
                                <p>Station</p>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Quay về trang chủ</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="flex items-center">
                <div className="relative w-64">
                    <div className="border-[1px] rounded-full flex items-center w-fit px-2 dark:bg-slate-800">
                        <input
                            type="text"
                            ref={searchRef}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onFocus={() => setFocus(true)}
                            onBlur={() => {
                                setFocus(false);
                            }}
                            className="w-64 h-10 px-2 after:absolute after:h-full after:w-[1px] bg-transparent after:bg-slate-900 after:right-0 focus:outline-none"
                        />
                        <div className="text-2xl">
                            <AiOutlineSearch />
                        </div>
                    </div>
                    {focusing ? (
                        <div
                            className="absolute w-96 h-fit top-12 left-[-64px] max-w-[95vw] bg-white dark:bg-slate-600 border-[1px] border-slate-400 rounded-lg"
                            ref={searchResultRef}
                        >
                            <div className="flex px-4 py-1 gap-9 h-max items-center">
                                <div className="flex items-center">
                                    <BsSearch />
                                </div>
                                <div className="flex items-center flex-1">
                                    <p className="m-0 w-full text-ellipsis break-words">
                                        {searchValue}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>

            <div className="flex gap-3 items-center">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div className="text-2xl cursor-pointer">
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
                                            href={"/station/upload/video"}
                                            className="w-full"
                                        >
                                            Video
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link
                                            href={"/station/upload/livestream"}
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
                            <p>Trò chuyện (đã có nhưng chưa cho vào chạy)</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <DropMenu />
            </div>
        </div>
    );
};

const MenuItem = ({
    children,
    className,
    ...props
}: React.HTMLProps<HTMLDivElement>) => {
    return (
        <div
            className={cn(
                "w-full px-3 py-3 rounded-sm cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700",
                className
            )}
            {...props}
        >
            <p className="w-full min-w-[160px] select-none">{children}</p>
        </div>
    );
};

export default StudioNavbar;
