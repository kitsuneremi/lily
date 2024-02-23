'use client'
import MenuItem from '@/components/own/navbar/MenuItem'
import ModeSetting from "@/components/own/navbar/ModeSetting";
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from "next-auth/react";
import type { Session } from 'next-auth'
import { CiMenuBurger } from "react-icons/ci";
import ChannelRender from "@/components/own/navbar/CheckChannel";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCallback } from 'react';


export default function LastMenu() {
    const { data: session, status: authenStatus } = useSession();


    const AccountAvatarRender =useCallback(() => {

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
    },[authenStatus, session]);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className='w-6 h-6 lg:w-8 lg:h-8 relative shadow-sm'>
                        {AccountAvatarRender()}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='mt-5' align='end'>
                    <div className='p-2'>
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
                                    <Link className='w-full h-full' href={'/setting/account'}>
                                        Cài đặt
                                    </Link>
                                </MenuItem>
                                <ModeSetting />
                            </div>
                        )}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}


