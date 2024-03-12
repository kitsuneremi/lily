"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { redirect, useParams, usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { baseURL } from "@/lib/functional";
import { Skeleton } from "@/components/ui/skeleton";
import SubcribeButton from "@/components/own/SubcribeButton";
import { Account } from '@/prisma/type'
type menuItem = {
    id: number;
    name: string;
    href: string;
};

const listMenuItem: menuItem[] = [
    {
        id: 0,
        name: "Trang chủ",
        href: "home",
    },
    {
        id: 1,
        name: "Video",
        href: "video",
    },
    {
        id: 2,
        name: "Sự kiện phát trực tiếp",
        href: "streaming",
    },
];
export default function Layout({ children }: { children: React.ReactNode }) {
    const [tab, setTab] = useState<number>(0);
    const params: { tagName: string } = useParams();
    const url = usePathname();
    const router = useRouter();
    const [channelData, setChannelData] = useState<Account>();

    useEffect(() => {
        axios
            .get("/api/channel/data", {
                params: {
                    tagName: params.tagName,
                },
            })
            .then((res) => setChannelData(res.data));
    }, [params.tagName]);

    useEffect(() => {
        listMenuItem.map((item) => {
            if (url.includes(item.href)) {
                setTab(listMenuItem.indexOf(item));
            }
        });
    }, [url]);

    return (
        <div className="flex flex-1 flex-col overflow-y-scroll gap-5">
            <div className="w-full pt-[18%] relative">
                {channelData && channelData.bannerLink ? (
                    <Image src={channelData.bannerLink} alt="" fill />
                ) : (
                    <Skeleton className="absolute w-full h-full top-0 left-0" />
                )}
            </div>
            <div className="flex justify-between">
                <div className="flex gap-4 items-center px-6">
                    <div className="relative w-20 aspect-square">
                        {channelData && channelData.avatarLink ? (
                            <Image
                                src={channelData.avatarLink}
                                alt=""
                                fill
                                sizes="1/1"
                                className="rounded-full"
                            />
                        ) : (
                            <Skeleton className="w-full h-full rounded-full" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <p className="text-2xl font-bold">{channelData?.name}</p>
                        <p className="text-lg font-semibold">{channelData ? `@${channelData.tagName}` : ""}</p>
                        <p>{channelData?.description}</p>
                    </div>
                </div>
                <div className="flex items-center pr-4">
                    {channelData ? <SubcribeButton channelData={channelData} /> : <Skeleton className="w-11 h-4 rounded-xl" />}
                </div>
            </div>
            <div className="w-full h-fit overflow-x-scroll hidden-scrollbar flex relative after:absolute after:w-full after:h-[1px] after:bg-slate-400 after:bottom-0 overflow-hidden min-h-[50px]">
                {listMenuItem.map((item, index) => {
                    return (
                        <div
                            className={`flex items-center justify-center px-4 cursor-pointer ${tab == item.id
                                ? "relative bg-slate-200 dark:bg-slate-700 after:absolute after:w-full after:h-[3px] after:bg-cyan-400 after:bottom-0 after:left-0"
                                : "hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                            key={index}
                            onClick={() => {
                                setTab(index);
                                router.push(
                                    `/channel/${params.tagName}/${item.href}`
                                );
                            }}
                        >
                            <p className="text-lg font-semibold m-0">{item.name}</p>
                        </div>
                    );
                })}
            </div>

            <div className="h-full">{children}</div>
        </div>
    );
}
