"use client";
import { useMediaQuery } from "usehooks-ts";
import { useEffect } from "react";
import React, { useState } from "react";
import {
    AiOutlineClose,
    AiOutlineRight,
    AiOutlineLeft,
    AiOutlineUpload,
    AiOutlineSearch,
} from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSsr } from "usehooks-ts";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/storage";
import { close, reverse } from "@/redux/features/sidebar-slice";
import MessageBox from "./navbar/Message";
// import LastMenu from '@/components/own/navbar/LastMenu'
import UploadBox from "./navbar/Upload";
const Notification = dynamic(() => import("@/components/own/navbar/Notification"));
const SearchModule = dynamic(() => import("@/components/own/navbar/SearchModule"));
const LastMenu = dynamic(() => import("@/components/own/navbar/LastMenu"));



export default function Navbar() {
    const dispatch = useDispatch();

    const openSidebar = useAppSelector(
        (state) => state.sidebarReducer.value.sidebar
    );

    const [mobileShowSearch, setMobileShowSearch] = useState<boolean>(false);

    const deviceType = {
        isPc: useMediaQuery("(min-width: 1280px"),
        isTablet: useMediaQuery("(min-width:768px) and (max-width: 1279px)"),
        isMobile: useMediaQuery("(max-width: 767px)"),
    };

    useEffect(() => {
        dispatch(close());
        setMobileShowSearch(false);
    }, [dispatch]);

    return (
        <>
            <div className="flex gap-8 select-none items-center">
                {
                    deviceType.isMobile
                        ?
                        mobileShowSearch
                            ?
                            <button className="text-2xl lg:text-3xl ml-3">
                                <AiOutlineClose
                                    onClick={() => {
                                        setMobileShowSearch(false);
                                    }}
                                />
                            </button>
                            :
                            <div className="text-2xl lg:text-3xl" onClick={() => { dispatch(reverse()); }}>
                                {openSidebar ? (
                                    <AiOutlineRight />
                                ) : (
                                    <AiOutlineLeft />
                                )}
                            </div>
                        :
                        <div className="text-2xl lg:text-3xl" onClick={() => { dispatch(reverse()); }}>
                            {openSidebar ? (
                                <AiOutlineRight />
                            ) : (
                                <AiOutlineLeft />
                            )}
                        </div>


                }
                {
                    (
                        !deviceType.isMobile
                        &&
                        !mobileShowSearch
                    )
                    &&
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
                }
            </div>



            {(!deviceType.isMobile || (deviceType.isMobile && mobileShowSearch)) && <SearchModule />}
            <div className="flex gap-3 items-center">
                {!mobileShowSearch && <div
                    className="md:hidden text-2xl lg:text-3xl"
                    onClick={() => {
                        setMobileShowSearch(true);
                    }}
                >
                    <AiOutlineSearch />
                </div>}
                <UploadBox />
                <Notification />
                <MessageBox />
                <LastMenu />
            </div>

        </>
    )
}

const MenuRender = (): React.ReactNode => {
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




