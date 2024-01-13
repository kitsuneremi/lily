import dynamic from "next/dynamic";
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
import { ChannelDataType } from "@/types/type";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { baseURL } from "@/lib/functional";

export default function LastMenu() {
    const popoverTriggerRef = useRef<HTMLDivElement>(null);
    const popoverContentRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const { data: session, status: authenStatus } = useSession();

    const [showPopover, setShowPopover] = useState<{
        click: boolean;
        menuFocus: boolean;
    }>({ click: false, menuFocus: false });

    useOnClickOutside(popoverTriggerRef, () => {
        setTimeout(
            () =>
                setShowPopover((prev) => {
                    return { click: false, menuFocus: prev.menuFocus };
                }),
            200
        );
    });
    useOnClickOutside(popoverContentRef, () => {
        setTimeout(
            () =>
                setShowPopover((prev) => {
                    return { click: prev.click, menuFocus: false };
                }),
            200
        );
    });

    const AccountAvatarRender = () => {
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

    useEffect(() => { console.log(authenStatus) }, [authenStatus])

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
                    {AccountAvatarRender()}
                </div>
                {(showPopover.click || showPopover.menuFocus) && (
                    <div
                        className="absolute w-max top-9 right-0 h-fit"
                        ref={popoverContentRef}
                        onClick={() => {
                            setShowPopover({
                                click: false,
                                menuFocus: true,
                            });
                        }}
                    >
                        {session?.user ? (
                            <div className="shadow-[0_0_5px_purple] p-3 bg-white dark:bg-[#020817]">
                                <Suspense fallback={<Skeleton className="h-full w-full rounded-full" />}>
                                    <ChannelRender />
                                </Suspense>
                                <MenuItem className="text-start">
                                    <div
                                        onClick={() => {
                                            signOut({
                                                redirect: true,
                                                callbackUrl: "/register",
                                            });
                                        }}
                                    >
                                        Đăng xuất
                                    </div>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        router.push("setting/account");
                                    }}
                                >
                                    Cài đặt
                                </MenuItem>
                                <ModeSetting />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 shadow-[0_0_5px_purple] p-3 rounded-lg bg-white dark:bg-[#020817]">
                                <MenuItem className="bg-gradient-to-r from-cyan-200 to-cyan-400 dark:from-cyan-400 dark:to-cyan-200 dark:hover:from-cyan-600 dark:hover:to-cyan-300 hover:bg-gradient-to-l hover:from-cyan-300 hover:to-cyan-600">
                                    <Link href={"/register"}>
                                        Đăng nhập
                                    </Link>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        router.push("setting/account");
                                    }}
                                >
                                    Cài đặt
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

async function ChannelRender() {
    const session = await getServerSession(authOptions);
    if (session) {
        const channelDataPromise = fetch(`${baseURL}/api/channel/data?accountId=${session.user.id}`, {
            method: "GET"
        })

        const channelData = await (await channelDataPromise).json() as ChannelDataType;

        if (channelData) {
            return (
                <>
                    <MenuItem className="bg-transparent">
                        <div className="flex gap-4">
                            <div className="flex items-center">
                                <div className="relative w-8 h-8">
                                    {channelData.avatarImage && (
                                        <Image
                                            className="rounded-full"
                                            src={
                                                channelData.avatarImage
                                            }
                                            alt=""
                                            fill
                                            sizes="1/1"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <p className="text-xl">{session.user.name}</p>
                            </div>
                        </div>
                    </MenuItem>
                    <MenuItem>
                        <Link className="w-full h-full" href={'/station'}>
                            Station
                        </Link>
                    </MenuItem>
                </>
            )
        } else {
            return (
                <MenuItem>
                    <Link className="w-full h-full" href={'/regchannel'}>
                        Chưa có kênh? Tạo ngay!
                    </Link>
                </MenuItem>
            )
        }
    } else {
        return <>no session</>
    }
}