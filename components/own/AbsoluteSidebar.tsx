"use client";
import { useEffectOnce, useOnClickOutside } from "usehooks-ts";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useSsr } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/storage";
import { close, reverse, open } from "@/redux/features/sidebar-slice";
import axios from "axios"
import Image from 'next/image'
import { useSession } from "next-auth/react";
import { ReduceString } from "@/lib/functional";
import { AiOutlineHome, AiOutlineRight, AiFillSetting } from "react-icons/ai";
import { MdFeedback } from 'react-icons/md'

type subcribe = {
    name: string,
    tagName: string,
    image: string
}

export default function Sidebar() {
    const { isBrowser } = useSsr();
    const router = useRouter();

    const sidebarRef = useRef<HTMLDivElement>(null);

    const {data: session, status} = useSession();

    const [subcribeList, setSubscribeList] = useState<subcribe[]>();
    const [showFullSubcribe, setShowFullSubcribe] = useState<boolean>(false);

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
    }, [session]);


    const SubcribedChannel = ({ item }: { item: subcribe }) => {
        return (
            <Link href={`/channel/${item.tagName}`}>
                <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600 px-2 py-1 rounded-lg"
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
            </Link>
        );
    };

    const FullRender = () => {
        return (
            <>
                <Link href={'/'} className="w-full">
                    <div
                        className={`flex justify-start items-center ${openSidebar ? 'gap-2' : ''} w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-2`}
                    >
                        <div className="flex flex-col justify-center"><AiOutlineHome /></div>
                        <div
                            className={`flex justify-center items-center ${openSidebar ? "" : "hidden"
                                }`}
                        >
                            <p className="">Trang chủ</p>
                        </div>
                    </div>
                </Link>
                <Link href={'/shorts'} className="w-full">
                    <div
                        className={`flex justify-start items-center ${openSidebar ? 'gap-2' : ''} w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-2`}
                    >
                        <div className="flex flex-col justify-center"><AiOutlineHome /></div>
                        <div
                            className={`flex justify-center items-center ${openSidebar ? "" : "hidden"
                                }`}
                        >
                            <p className="">Short</p>
                        </div>
                    </div>
                </Link>
                <Link href={'/subcribe'} className="w-full">
                    <div
                        className={`flex justify-start items-center ${openSidebar ? 'gap-2' : ''} w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-2`}
                    >
                        <div className="flex flex-col justify-center"><AiOutlineHome /></div>
                        <div
                            className={`flex justify-center items-center ${openSidebar ? "" : "hidden"
                                }`}
                        >
                            <p className="">Kênh đăng ký</p>
                        </div>
                    </div>
                </Link>

                <div className="w-full h-[2px] relative after:absolute after:bg-slate-300 dark:after:bg-slate-500 after:h-[90%] after:top-[5%] after:left-0 after:w-full" />
                {/* tùy chọn thuộc về tài khỏan/kênh */}
                <Link href={'/feed/you'} className="w-full">
                    <div
                        className={`flex justify-start items-center ${openSidebar ? 'gap-2' : ''} w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-1 px-2`}
                    >
                        <div
                            className={`flex justify-center items-center ${openSidebar ? "" : "hidden"
                                }`}
                        >
                            <p className="">Bạn</p>
                        </div>
                        <div className="flex flex-col justify-center"><AiOutlineRight /></div>
                    </div>
                </Link>
                <Link href={`/channel/`} className="w-full">
                    <div
                        className={`flex justify-start items-center ${openSidebar ? 'gap-2' : ''} w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-2`}
                    >
                        <div className="flex flex-col justify-center"><AiOutlineHome /></div>
                        <div
                            className={`flex justify-center items-center ${openSidebar ? "" : "hidden"
                                }`}
                        >
                            <p className="">Kênh của bạn</p>
                        </div>

                    </div>
                </Link>
                <Link href={'/feed/later'} className="w-full">
                    <div
                        className={`flex justify-start items-center ${openSidebar ? 'gap-2' : ''} w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-2`}
                    >
                        <div className="flex flex-col justify-center"><AiOutlineHome /></div>
                        <div
                            className={`flex justify-center items-center ${openSidebar ? "" : "hidden"
                                }`}
                        >
                            <p className="">Video xem sau</p>
                        </div>

                    </div>
                </Link>

                {
                    subcribeList && <>
                        <div className="w-full h-[2px] relative after:absolute after:bg-slate-300 dark:after:bg-slate-500 after:h-[90%] after:top-[5%] after:left-0 after:w-full" />
                        <p className="w-full text-lg pl-2">Kênh đăng ký</p>
                        {/* kênh đăng ký */}
                        <div className="">
                            {subcribeList.length > 5 && <div className="w-full" onClick={() => { setShowFullSubcribe(prev => { return !prev }) }}>{showFullSubcribe ? 'Ẩn bớt' : `Hiển thị {subcribeList.length - 5} kênh nữa`}</div>}
                            {showFullSubcribe ? subcribeList.map((item, index) => {
                                return <SubcribedChannel item={item} key={index} />
                            }) : subcribeList.slice(0, 5).map((item, index) => {
                                return <SubcribedChannel item={item} key={index} />
                            })}
                        </div>
                    </>
                }

                <div className="w-full h-[2px] relative after:absolute after:bg-slate-300 dark:after:bg-slate-500 after:h-[90%] after:top-[5%] after:left-0 after:w-full" />

                <Link href={'/setting/account'} className="w-full">
                    <div
                        className={`flex justify-start items-center ${openSidebar ? 'gap-2' : ''} w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-2`}
                    >
                        <div className="flex flex-col justify-center"><AiFillSetting /></div>
                        <div
                            className={`flex justify-center items-center ${openSidebar ? "" : "hidden"
                                }`}
                        >
                            <p className="">Cài đặt</p>
                        </div>
                    </div>
                </Link>
                <Link href={'/feedback'} className="w-full">
                    <div
                        className={`flex justify-start items-center ${openSidebar ? 'gap-2' : ''} w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-2`}
                    >
                        <div className="flex flex-col justify-center"><MdFeedback /></div>
                        <div
                            className={`flex justify-center items-center ${openSidebar ? "" : "hidden"
                                }`}
                        >
                            <p className="">Góp ý</p>
                        </div>
                    </div>
                </Link>
            </>
        )
    }

    if (isBrowser) {
        if (openSidebar) {
            return (
                <div ref={sidebarRef} className={'overflow-y-scroll min-w-[220px] h-full flex fixed top-16 flex-col gap-1 w-max items-start hidden-scrollbar px-3 bg-slate-300 dark:bg-slate-950 z-50'}>
                    <FullRender />
                </div>
            )
        }

    }
}
