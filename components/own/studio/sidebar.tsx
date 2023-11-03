'use client'
import Image from "next/image"
import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '@/redux/storage';
import { open, reverse, close } from "@/redux/features/sidebar-slice";
import { useSession } from "next-auth/react";
import { ReactElement, useEffect, useState, useRef } from "react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { FcBullish } from 'react-icons/fc'
import Link from "next/link";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase'
import { ChannelDataType } from "@/types/type";
import axios from "axios";
import { BsUpload } from 'react-icons/bs'
import { authOptions } from "@/lib/auth";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton";

const Sidebar = () => {

    const sidebar = useAppSelector(state => state.sidebarReducer.value.sidebar)
    const dispatch = useDispatch();
    const { data: session } = useSession({ required: true, onUnauthenticated: () => redirect('/register') });
    const url = usePathname();
    const router = useRouter();

    const sidebarRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(sidebarRef, () => {
        if (sidebar) { setTimeout(() => dispatch(close()), 200) }
    })

    const [channelData, setChannelData] = useState<ChannelDataType>();
    const [tab, setTab] = useState<number>(0)

    const deviceType = {
        isFlex: useMediaQuery("(min-width: 1200px"),
        isAbsolute: useMediaQuery("(max-width: 1199px)"),
    };

    useEffect(() => {
        if (session && session.user) {
            axios.get('/api/channel/data', {
                params: {
                    //@ts-ignore
                    accountId: session?.user.id
                }
            }).then(res => {
                console.log(res)
                setChannelData(res.data)
            }).catch(e => {
                redirect('/regchannel')
            })
        }
    }, [session])

    useEffect(() => {
        if (url.includes('/overview')) {
            setTab(0)
        } else if (url.includes('/videos')) {
            setTab(1)
        } else if (url.includes('/upload')) {
            setTab(2)
        } else if (url.includes('/analytics')) {
            setTab(3)
        } else if (url.includes('/comment')) {
            setTab(4)
        } else if (url.includes('/settings')) {
            setTab(5)
        }
    }, [url])

    if (deviceType.isFlex) {
        return (
            <div className="flex-0 bg-transparent h-full justify-between flex flex-col pb-6">
                <div>
                    <div className="flex flex-col gap-3 px-3 text-center items-center">
                        {channelData?.avatarImage ?
                            <Image src={channelData.avatarImage} className="bg-transparent rounded-full" alt="" sizes="1/1" width={sidebar ? 90 : 30} height={sidebar ? 90 : 30} />
                            :
                            <Skeleton className="w-[90px] h-[90px] rounded-full" />}
                        {sidebar && <p>{channelData?.name}</p>}
                    </div>
                    <div className={`flex flex-col mt-4 w-max ${sidebar ? '' : 'justify-center items-center'}`}>
                        <Link href='/station/overview'>
                            <div className={`flex px-4 py-3 gap-2 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${tab === 0 ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>
                                <div className="flex items-center">
                                    <FcBullish />
                                </div>
                                {sidebar && <p className="">Trang tổng quan</p>}
                            </div>
                        </Link>
                        <Link href='/station/videos'>
                            <div className={`flex px-4 py-3 gap-2 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${tab === 1 ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>
                                <div className="flex items-center">
                                    <FcBullish />
                                </div>
                                {sidebar && <p className="">Nội dung</p>}
                            </div>
                        </Link>

                        {sidebar ? <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger className={`px-4 py-3 hover:no-underline hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${tab === 2 ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>
                                    <div className="flex gap-2">
                                        <div className="flex items-center">
                                            <BsUpload />
                                        </div>
                                        <p className="">Đăng tải</p>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="w-full mt-2">
                                        <Link href={'/station/upload/video'}><div className="pl-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">Video</div></Link>
                                        <Link href={'/station/upload/livestream'}><div className="pl-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">Nội dung phát trực tiếp</div></Link>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion> : <>
                            <div onClick={() => { dispatch(open()) }} className={`flex px-4 py-3 gap-2 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${tab === 0 ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>
                                <div className="flex items-center">
                                    <BsUpload />
                                </div>
                            </div></>}
                        <Link href='/station/analytics'>
                            <div className={`flex px-4 py-3 gap-2 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${tab === 3 ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>
                                <div className="flex items-center">
                                    <FcBullish />
                                </div>
                                {sidebar && <p className="">Số liệu phân tích</p>}
                            </div>
                        </Link>
                        <Link href='/station/comment'>
                            <div className={`flex px-4 py-3 gap-2 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${tab === 4 ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>
                                <div className="flex items-center">
                                    <FcBullish />
                                </div>
                                {sidebar && <p className="">Bình luận</p>}
                            </div>
                        </Link>

                    </div>
                </div>
                <div>
                    <div className={`flex flex-col mt-4 ${sidebar ? '' : 'justify-center items-center'}`}>
                        <Link href={`/station/settings`}>
                            <div className={`flex px-4 py-3 gap-2 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${tab === 5 ? 'relative after:absolute after:w-[90%] after:h-[2px] after:bg-cyan-400 after:bottom-0 after:left-[5%]' : ''}`}>
                                <div className="flex items-center">
                                    <FcBullish />
                                </div>
                                {sidebar && <p className="">cài đặt</p>}
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={`w-fit h-[calc(100vh-64px)] fixed left-0 top-16 bg-slate-300 dark:bg-slate-800 ${sidebar ? '' : 'hidden'} z-50`}>
                <div className="flex-0 bg-transparent h-full justify-between flex flex-col pb-6" ref={sidebarRef}>
                    <div>
                        <div className="flex flex-col gap-3 px-3 text-center items-center">
                            {channelData?.avatarImage ?
                                <Image src={channelData.avatarImage} className="bg-transparent rounded-full" alt="" sizes="1/1" width={90} height={90} />
                                :
                                <></>}
                            <p>{channelData?.name}</p>
                        </div>
                        <div className={`flex flex-col mt-4 w-max`}>
                            <Link href='/station/overview'>
                                <div className={`flex px-4 py-3 gap-2 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${tab === 0 ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>
                                    <div className="flex items-center">
                                        <FcBullish />
                                    </div>
                                    <p className="">Trang tổng quan</p>
                                </div>
                            </Link>
                            <Link href='/station/videos'>
                                <div className={`flex px-4 py-3 gap-2 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${tab === 1 ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>
                                    <div className="flex items-center">
                                        <FcBullish />
                                    </div>
                                    <p className="">Nội dung</p>
                                </div>
                            </Link>

                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className={`px-4 py-3 hover:no-underline hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${tab === 2 ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>
                                        <div className="flex gap-2">
                                            <div className="flex items-center">
                                                <BsUpload />
                                            </div>
                                            <p className="">Đăng tải</p>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="w-full">
                                            <Link href={'/station/upload/video'}><div className="pl-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">Video</div></Link>
                                            <Link href={'/station/upload/livestream'}><div className="pl-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">Nội dung phát trực tiếp</div></Link>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <Link href='/station/analytics'>
                                <div className={`flex px-4 py-3 gap-2 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${tab === 3 ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>
                                    <div className="flex items-center">
                                        <FcBullish />
                                    </div>
                                    <p className="">Số liệu phân tích</p>
                                </div>
                            </Link>
                            <Link href='/station/comment'>
                                <div className={`flex px-4 py-3 gap-2 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${tab === 4 ? 'bg-slate-300 dark:bg-slate-700' : ''}`}>
                                    <div className="flex items-center">
                                        <FcBullish />
                                    </div>
                                    <p className="">Bình luận</p>
                                </div>
                            </Link>

                        </div>
                    </div>
                    <div>
                        <div className={`flex flex-col mt-4 ${sidebar ? '' : 'justify-center items-center'}`}>
                            <Link href={`/station/settings`}>
                                <div className={`flex px-4 py-3 gap-2 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer ${tab === 5 ? 'relative after:absolute after:w-[90%] after:h-[2px] after:bg-cyan-400 after:bottom-0 after:left-[5%]' : ''}`}>
                                    <div className="flex items-center">
                                        <FcBullish />
                                    </div>
                                    <p className="">cài đặt</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Sidebar

