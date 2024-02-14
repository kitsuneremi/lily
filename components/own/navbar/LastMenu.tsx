'use client'
import MenuItem from '@/components/own/navbar/MenuItem'
import ModeSetting from "@/components/own/navbar/ModeSetting";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { Skeleton } from '@/components/ui/skeleton'
import { useOnClickOutside } from "usehooks-ts";
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from "next-auth/react";
import { CiMenuBurger } from "react-icons/ci";
import ChannelRender from "@/components/own/navbar/CheckChannel";

export default function LastMenu() {
    const popoverTriggerRef = useRef<HTMLDivElement>(null);
    const popoverContentRef = useRef<HTMLDivElement>(null);

    const { data: session, status: authenStatus } = useSession();

    const [showPopover, setShowPopover] = useState<{
        click: boolean;
        menuFocus: boolean;
    }>({ click: false, menuFocus: false });

    useOnClickOutside(popoverTriggerRef, () => {
        setShowPopover((prev) => {
            return { click: false, menuFocus: prev.menuFocus };
        })
    });
    useOnClickOutside(popoverContentRef, () => {
        setShowPopover((prev) => {
            return { click: prev.click, menuFocus: false };
        })
    });



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
                        className="absolute w-max top-11 right-0 h-fit rounded-xl px-3 py-2 bg-white dark:bg-[#020817] shadow-2xl border-[1px] border-solid border-slate-800 border-opacity-50"
                        ref={popoverContentRef}
                        onClickCapture={() => {
                            setShowPopover({
                                click: false,
                                menuFocus: true,
                            });
                        }}
                    >
                        {session?.user ? (
                            <div className="">
                                <ChannelRender />
                                <MenuItem className="text-start">
                                    <div
                                        onClickCapture={() => {
                                            signOut({
                                                redirect: true,
                                                callbackUrl: "/register",
                                            });
                                        }}
                                    >
                                        Đăng xuất
                                    </div>
                                </MenuItem>
                                <MenuItem>
                                    <Link className='w-full h-full' href={'setting/account'}>
                                        Cài đặt
                                    </Link>
                                </MenuItem>
                                <ModeSetting />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <MenuItem className="bg-gradient-to-r from-cyan-200 to-cyan-400 dark:from-cyan-400 dark:to-cyan-200 dark:hover:from-cyan-600 dark:hover:to-cyan-300 hover:bg-gradient-to-l hover:from-cyan-300 hover:to-cyan-600">
                                    <Link href={"/register"}>
                                        Đăng nhập
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link className='w-full h-full' href={'setting/account'}>
                                        Cài đặt
                                    </Link>
                                </MenuItem>
                                <ModeSetting />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}


const AccountAvatarRender = (): React.ReactNode => {
    const { data: session, status: authenStatus } = useSession();
    if (authenStatus == "loading") {
        return <Skeleton className="h-full w-full rounded-full" />;
    } else if (authenStatus == "authenticated" && session && session.user.image != "") {
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
            <div className="flex text-xl bg-slate-200 dark:bg-slate-900 rounded-full w-full h-full items-center justify-center">
                <CiMenuBurger />
            </div>
        );
    }
};