"use client";
import { useEffectOnce, useOnClickOutside } from "usehooks-ts";
import React, {
    useRef,
    useEffect,
    useState,
    useMemo,
    useCallback,
} from "react";
import { AiOutlineHome, AiOutlineRight, AiFillSetting } from "react-icons/ai";
import { MdFeedback } from "react-icons/md";
import Link from "next/link";
import { useSsr, useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/storage";
import { close, reverse, open } from "@/redux/features/sidebar-slice";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ReduceString } from "@/lib/functional";
import dynamic from "next/dynamic";
const SubcribedChannelRender = dynamic(() => import('@/components/own/sidebar/SubcribbedChannelRender'))
type subcribe = {
    name: string;
    tagName: string;
    image: string;
};


const listMenu = [
    {
        title: "Trang chủ",
        icon: <AiOutlineHome />,
        link: "/",
    },
    {
        title: "Shorts",
        icon: <AiOutlineHome />,
        link: "/shorts",
    },
    {
        title: "Kênh đăng ký",
        icon: <AiOutlineHome />,
        link: "/subcribe",
    }
]

export default function Sidebar() {
    const { isBrowser } = useSsr();

    const { data: session, status } = useSession();
    const deviceType = {
        isFlex: useMediaQuery("(min-width: 1200px"),
        isAbsolute: useMediaQuery("(max-width: 1199px)"),
    };

    const [subcribedList, setSubscribedList] = useState<subcribe[]>();


    const sidebarRef = useRef<HTMLDivElement>(null);

    const openSidebar = useAppSelector(
        (state) => state.sidebarReducer.value.sidebar
    );
    const dispatch = useDispatch();

    useOnClickOutside(sidebarRef, () => {
        dispatch(close());
    });

    useEffect(() => {
        if (deviceType.isFlex) {
            dispatch(open());
        } else if (deviceType.isAbsolute) {
            dispatch(close());
        }
    }, []);

    useEffect(() => {
        if (status === "authenticated") {
            axios
                .get("/api/account/subcribed", {
                    params: {
                        accountId: session.user.id,
                    },
                })
                .then((res) => {
                    setSubscribedList(res.data);
                });
        }
    }, [session]);



    const FullRender = () => {
        return (
            <div className="py-2">
                {listMenu.map((menu, index) => {
                    return (
                        <Link href={menu.link} className="w-full" key={index}>
                            <div
                                className={`flex justify-start items-center rounded-md hover:shadow-lg hover:scale-105 group ${openSidebar ? "gap-2" : ""
                                    } w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-2`}
                            >
                                <div className="flex flex-col justify-center group-hover:scale-105 group-hover:text-purple-900 dark:group-hover:text-purple-400 group-hover:font-semibold">
                                    {menu.icon}
                                </div>
                                <div
                                    className={`flex justify-center items-center group-hover:text-[17px] group-hover:text-purple-900 dark:group-hover:text-purple-400 group-hover:font-semibold ${openSidebar ? "" : "hidden"
                                        }`}
                                >
                                    <p className="">{menu.title}</p>
                                </div>
                            </div>
                        </Link>
                    )
                })}

                <div className="w-full my-2 h-[2px] relative after:absolute after:bg-slate-300 dark:after:bg-slate-500 after:h-[90%] after:top-[5%] after:left-0 after:w-full" />
                {/* tùy chọn thuộc về tài khỏan/kênh */}
                <Link href={"/feed/you"} className="w-full">
                    <div
                        className={`flex justify-start items-center ${openSidebar ? "gap-2" : ""
                            } w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-1 px-2`}
                    >
                        <div
                            className={`flex justify-center items-center ${openSidebar ? "" : "hidden"
                                }`}
                        >
                            <p className="">Bạn</p>
                        </div>
                        <div className="flex flex-col justify-center">
                            <AiOutlineRight />
                        </div>
                    </div>
                </Link>
                <Link href={`/channel/`} className="w-full">
                    <div
                        className={`flex justify-start items-center ${openSidebar ? "gap-2" : ""
                            } w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-2`}
                    >
                        <div className="flex flex-col justify-center">
                            <AiOutlineHome />
                        </div>
                        <div
                            className={`flex justify-center items-center ${openSidebar ? "" : "hidden"
                                }`}
                        >
                            <p className="">Kênh của bạn</p>
                        </div>
                    </div>
                </Link>
                <Link href={"/feed/later"} className="w-full">
                    <div
                        className={`flex justify-start items-center ${openSidebar ? "gap-2" : ""
                            } w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-2`}
                    >
                        <div className="flex flex-col justify-center">
                            <AiOutlineHome />
                        </div>
                        <div
                            className={`flex justify-center items-center ${openSidebar ? "" : "hidden"
                                }`}
                        >
                            <p className="">Video xem sau</p>
                        </div>
                    </div>
                </Link>

                {subcribedList && <SubcribedChannelRender subcribedList={subcribedList} />}

                <div className="w-full my-2 h-[2px] relative after:absolute after:bg-slate-300 dark:after:bg-slate-500 after:h-[90%] after:top-[5%] after:left-0 after:w-full" />

                <Link href={"/setting/account"} className="w-full">
                    <div
                        className={`flex justify-start items-center ${openSidebar ? "gap-2" : ""
                            } w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-2`}
                    >
                        <div className="flex flex-col justify-center">
                            <AiFillSetting />
                        </div>
                        <div
                            className={`flex justify-center items-center ${openSidebar ? "" : "hidden"
                                }`}
                        >
                            <p className="">Cài đặt</p>
                        </div>
                    </div>
                </Link>
                <Link href={"/feedback"} className="w-full">
                    <div
                        className={`flex justify-start items-center ${openSidebar ? "gap-2" : ""
                            } w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-2 px-2`}
                    >
                        <div className="flex flex-col justify-center">
                            <MdFeedback />
                        </div>
                        <div
                            className={`flex justify-center items-center ${openSidebar ? "" : "hidden"
                                }`}
                        >
                            <p className="">Góp ý</p>
                        </div>
                    </div>
                </Link>
            </div>
        );
    };

    const MiniRender = () => {
        return (
            <>
                <Link href={"/"}>
                    <div className="flex flex-col items-center hover:bg-slate-200 dark:hover:bg-slate-700 p-1 ml-2 rounded-lg">
                        <div className="text-2xl max-sm:text-base">
                            <AiOutlineHome />
                        </div>
                        <p className="text-xs">Trang chủ</p>
                    </div>
                </Link>
                <Link href={"/shorts"}>
                    <div className="flex flex-col items-center hover:bg-slate-200 dark:hover:bg-slate-700  p-1 ml-2 rounded-lg">
                        <div className="text-2xl max-sm:text-base">
                            <AiOutlineHome />
                        </div>
                        <p className="text-xs">Shorts</p>
                    </div>
                </Link>
                <Link href={"/subcribe"}>
                    <div className="flex flex-col items-center hover:bg-slate-200 dark:hover:bg-slate-700  p-1 ml-2 rounded-lg">
                        <div className="text-2xl max-sm:text-base">
                            <AiOutlineHome />
                        </div>
                        <p className="text-xs text-center">Kênh đăng ký</p>
                    </div>
                </Link>
                <Link href={"/feed/you"}>
                    <div className="flex flex-col items-center hover:bg-slate-200 dark:hover:bg-slate-700  p-1 ml-2 rounded-lg">
                        <div className="text-2xl max-sm:text-base">
                            <AiOutlineHome />
                        </div>
                        <p className="text-xs">Bạn</p>
                    </div>
                </Link>
                <Link href={"/setting/account"}>
                    <div className="flex flex-col items-center hover:bg-slate-200 dark:hover:bg-slate-700  p-1 ml-2 rounded-lg">
                        <div className="text-2xl max-sm:text-base">
                            <AiFillSetting />
                        </div>
                        <p className="text-xs">Cài đặt</p>
                    </div>
                </Link>
                <Link href={"/feedback"}>
                    <div className="flex flex-col items-center hover:bg-slate-200 dark:hover:bg-slate-700  p-1 ml-2 rounded-lg">
                        <div className="text-2xl max-sm:text-base">
                            <MdFeedback />
                        </div>
                        <p className="text-xs">Phản hồi</p>
                    </div>
                </Link>
            </>
        );
    };

    if (isBrowser) {
        if (deviceType.isFlex) {
            if (openSidebar) {
                return (
                    <div
                        className={`flex min-w-[200px] flex-col gap-1 w-max overflow-y-scroll items-start hidden-scrollbar px-3`}
                    >
                        <FullRender />
                    </div>
                );
            } else {
                return (
                    <div className="w-max flex flex-col gap-3">
                        <MiniRender />
                    </div>
                );
            }
        } else if (deviceType.isAbsolute) {
            return (
                <>
                    {/* <div className="w-max flex flex-col gap-3">
                        <MiniRender />
                    </div> */}
                    <div
                        ref={sidebarRef}
                        className={`${openSidebar
                            ? "overflow-y-scroll min-w-[220px] h-[calc(100vh-64px)] flex fixed top-16 flex-col gap-1 w-max items-start hidden-scrollbar px-3 bg-slate-50 dark:bg-slate-800 z-50"
                            : "hidden"
                            }`}
                    >
                        <FullRender />
                    </div>
                </>
            );
        }
    }
}
