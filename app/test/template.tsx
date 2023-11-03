"use client";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Navbar from "@/components/own/navbar";
import Sidebar from "@/components/own/absoluteSidebar";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/storage";
import { close, reverse, open } from "@/redux/features/sidebar-slice";
import { useOnClickOutside } from "usehooks-ts";

export default function TestTemplate({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();

    const sidebarRef = useRef<HTMLDivElement>(null);

    const openSidebar = useAppSelector(
        (state) => state.sidebarReducer.value.sidebar
    );
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(session);
    }, [session]);

    useOnClickOutside(sidebarRef, () => {
        close();
    });

    return (
        <div className="w-full flex flex-col h-screen">
            <div className="w-screen h-16 flex justify-between fixed top-0 left-0 px-3 lg:px-8 py-4 bg-white dark:bg-[#020817] z-10">
                <Navbar />
            </div>
            <div className="flex mt-16 h-[calc(100vh-64px)] overflow-y-clip">
                <Sidebar />
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}
