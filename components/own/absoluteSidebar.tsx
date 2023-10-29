"use client";
import { useEffectOnce, useOnClickOutside } from "usehooks-ts";
import React, { useRef } from "react";
import { AiOutlineHome } from "react-icons/ai";
import Link from "next/link";
import { useSsr } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/storage";
import { close, reverse, open } from "@/redux/features/sidebar-slice";

export default function Sidebar() {
    const { isBrowser } = useSsr();
    const router = useRouter();

    const sidebarRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(sidebarRef, () => {
        dispatch(close());
    });

    const openSidebar = useAppSelector(
        (state) => state.sidebarReducer.value.sidebar
    );
    const dispatch = useDispatch();

    useEffectOnce(() => {
        dispatch(close());
    });

    const res = () => {
        if (isBrowser) {
            if (openSidebar == true) {
                return (
                    <div
                        className="fixed w-[210px] left-0 z-10 h-[calc(100vh-64px)] py-3 flex flex-col gap-2 bg-white dark:bg-slate-950"
                        ref={sidebarRef}
                    >
                        <Item
                            icon={<AiOutlineHome />}
                            name="trang chủ"
                            href="/"
                            openSidebar={openSidebar}
                        />
                        <Item
                            icon={<AiOutlineHome />}
                            name="thư viện"
                            href="/libary"
                            openSidebar={openSidebar}
                        />
                        <Item
                            icon={<AiOutlineHome />}
                            name="đã thích"
                            href="/like"
                            openSidebar={openSidebar}
                        />
                        <Item
                            icon={<AiOutlineHome />}
                            name="đã xem"
                            href="/abc"
                            openSidebar={openSidebar}
                        />
                    </div>
                );
            } else if (openSidebar == false) {
                return <></>;
            }
        }
    };

    return <>{isBrowser ? res() : <></>}</>;
}

const Item = ({
    name,
    href,
    icon,
    openSidebar,
}: {
    name: string;
    href: string;
    icon: React.ReactElement;
    openSidebar: boolean;
}) => {
    return (
        <Link href={href}>
            <div
                className={`flex justify-center items-center gap-2 w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-3 px-5`}
            >
                <div className="flex flex-col justify-center">{icon}</div>
                <div
                    className={`flex justify-center items-center ${
                        openSidebar ? "" : "hidden"
                    }`}
                >
                    <p className="">{name}</p>
                </div>
            </div>
        </Link>
    );
};
