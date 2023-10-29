"use client";
import { useEffectOnce } from "usehooks-ts";
import React, { useRef, useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import Link from "next/link";
import { useSsr, useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/storage";
import { close, reverse, open } from "@/redux/features/sidebar-slice";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ReduceString } from '@/lib/functional'
type MenuItem = {
    name: string;
    href: string;
    icon: React.ReactElement;
    child?: {
        image: string;
        name: string;
        tagName: string;
    }[];
};

type subcribe = {
    name: string,
    tagName: string,
    image: string
}



export default function Sidebar() {
    const { isBrowser } = useSsr();
    const router = useRouter();

    const { data: session, status } = useSession();

    const [subcribeList, setSubscribeList] = useState<subcribe[]>();

    const listMenu: MenuItem[] = [
        {
            name: "trang chủ",
            href: "/",
            icon: <AiOutlineHome />,
        },
        {
            name: "thư viện",
            href: "/libary",
            icon: <AiOutlineHome />,
        },
        {
            name: "đã thích",
            href: "/like",
            icon: <AiOutlineHome />,
        },
        {
            name: "đã xem",
            href: "/abc",
            icon: <AiOutlineHome />,
        },
        {
            name: "kênh đăng ký",
            href: "",
            icon: <AiOutlineHome />,
            child: subcribeList,
        },
    ];

    const sidebarRef = useRef<HTMLDivElement>(null);

    const openSidebar = useAppSelector(
        (state) => state.sidebarReducer.value.sidebar
    );
    const dispatch = useDispatch();

    useEffectOnce(() => {
        dispatch(close());
    });

    useEffect(() => {
        if (status === "authenticated") {
            axios.get('/api/account/subcribed', {
                params: {
                    accountId: session.user.id
                }
            }).then(res => {
                setSubscribeList(res.data)
            })
        }
    }, [session])

    const deviceType = {
        isPc: useMediaQuery("(min-width: 1200px"),
        isTablet: useMediaQuery("(min-width:700px) and (max-width: 1199px)"),
        isMobile: useMediaQuery("(max-width: 699px)"),
    };

    const Item = ({
        name,
        href,
        icon,
    }: {
        name: string;
        href: string;
        icon: React.ReactElement;
    }) => {
        return (
            <Link href={href} className="w-full">
                <div
                    className={`flex justify-start items-center ${openSidebar ? 'gap-2' : ''} w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-3 px-5`}
                >
                    <div className="flex flex-col justify-center">{icon}</div>
                    <div
                        className={`flex justify-center items-center ${openSidebar ? "" : "hidden"
                            }`}
                    >
                        <p className="">{name}</p>
                    </div>
                </div>
            </Link>
        );
    };

    const BigItem = ({
        name,
        icon,
        child,
    }: {
        name: string;
        icon: React.ReactElement;
        child: {
            name: string;
            tagName: string;
            image: string;
        }[];
    }) => {
        return (
            <div className={`flex flex-col justify-start ${openSidebar ? 'gap-2' : ''} w-full`}>
                <div className="flex hover:bg-slate-200 dark:hover:bg-slate-700 gap-2 py-3 px-5 rounded-lg cursor-default">
                    <div className="flex flex-col justify-center">{icon}</div>
                    <div
                        className={`flex justify-center items-center ${openSidebar ? "" : "hidden"
                            }`}
                    >
                        <p className="">{name}</p>
                    </div>
                </div>
                {openSidebar && <div className="pl-7 flex flex-col gap-2">
                    {child.map((item, index) => {
                        return (
                            <div
                                className="flex items-center gap-2 cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600 px-2 py-1 rounded-lg"
                                onClick={() => { router.push(`/channel/${item.tagName}`) }}
                                key={index}
                            >
                                <div className="flex flex-col justify-center">
                                    <div className="flex items-center w-4 h-4 relative">
                                        <Image
                                            fill
                                            sizes={"1/1"}
                                            src={item.image}
                                            alt={item.name}
                                            className="rounded-full"
                                        />
                                    </div>
                                </div>
                                <div
                                    className={`flex justify-center items-center ${openSidebar ? "" : "hidden"
                                        }`}
                                >
                                    <p className="">{ReduceString({ maxLength: 16, string: item.name })}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>}
            </div>
        );
    };

    const res = () => {
        if (deviceType.isPc && openSidebar !== undefined) {
            return (
                <div className={`flex ${openSidebar ? 'min-w-[200px]' : ''} flex-col gap-2 w-max overflow-y-scroll items-start hidden-scrollbar px-3`}>
                    {listMenu.map((item, index) => {
                        return item.child ? (
                            <BigItem
                                child={item.child}
                                icon={item.icon}
                                name={item.name}
                                key={index}
                            />
                        ) : (
                            <Item
                                icon={item.icon}
                                name={item.name}
                                href={item.href}
                                key={index}
                            />
                        );
                    })}
                </div>
            );
        } else if (deviceType.isTablet && openSidebar !== undefined) {
            return (
                <div
                    className="flex flex-col gap-2 w-max px-3 items-start"
                    ref={sidebarRef}
                >
                    {listMenu.map((item, index) => {
                        return item.child ? (
                            <BigItem
                                child={item.child}
                                icon={item.icon}
                                name={item.name}
                                key={index}
                            />
                        ) : (
                            <Item
                                icon={item.icon}
                                name={item.name}
                                href={item.href}
                                key={index}
                            />
                        );
                    })}
                </div>
            );
        } else if (
            deviceType.isMobile &&
            openSidebar == true &&
            openSidebar !== undefined
        ) {
            return (
                <div
                    className="fixed w-[220px] left-0 z-10 h-[calc(100vh-64px)] py-3 flex flex-col gap-2 bg-white dark:bg-slate-950"
                    ref={sidebarRef}
                >
                    <Link href={"/"}>
                        <div className="flex justify-around w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-3 px-2 items-center">
                            <div className="flex flex-col justify-center">
                                <AiOutlineHome />
                            </div>
                            <p className="min-w-[100px]">Home</p>
                        </div>
                    </Link>
                </div>
            );
        } else if (openSidebar == false) {
            return <></>;
        }
    };

    return <>{isBrowser ? res() : <></>}</>;
}
