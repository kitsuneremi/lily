"use client";
import React, { Ref, useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";

import Sidebar from "@/components/own/AbsoluteSidebar";
import Navbar from "@/components/own/Navbar";
import { useOnClickOutside } from "usehooks-ts";
import { useDispatch } from "react-redux";
import { close, reverse, open } from "@/redux/features/sidebar-slice";

const sideMenuItem = [
    { id: 0, name: "Tài khoản", href: "/setting/account" },
    { id: 1, name: "Nâng cao", href: "/setting/advance" },
    { id: 2, name: "Tải xuống", href: "/setting/download" },
    { id: 3, name: "Thông báo", href: "/setting/notification" },
    { id: 4, name: "Phát lại", href: "/setting/playback" },
    { id: 5, name: "Quyền riêng tư", href: "/setting/privacy" },
];


export default function Template({children}:{children:React.ReactNode}){
    const path = usePathname();


    const dispatch = useDispatch();


    useEffect(() => {
        const find = sideMenuItem.find((item) => {
            return item.href === path;
        });
        if (find) {
            setTab(find.id);
        } else {
            redirect("/setting/account");
        }
    }, [path]);

    const [tab, setTab] = useState<number>();

    return (
        <div className="w-full flex flex-col h-screen">
            <div className="w-screen h-16 flex justify-between fixed top-0 left-0 px-3 lg:px-8 py-4 bg-white dark:bg-[#020817] z-10">
                <Navbar/>
            </div>
            <div className="flex mt-16 h-[calc(100vh-64px)] overflow-y-clip">
                <Sidebar/>
                <div className="flex">
                    <div className="grid grid-flow-row grid-cols-1 gap-2 h-fit pl-3">
                        {sideMenuItem.map((item, index) => {
                            return (
                                <div
                                    className={`px-5 py-2 w-max rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 ${
                                        tab == item.id
                                            ? "shadow-[0_0_5px_purple_inset]"
                                            : ""
                                    }`}
                                    key={index}
                                    onClick={() => {
                                        redirect(item.href);
                                    }}
                                >
                                    <Link
                                        className="w-full h-full"
                                        href={`${item.href}`}
                                    >
                                        {item.name}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}


