import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import MenuItem from "./MenuItem";
import Image from "next/image";
import axios from 'axios'
import { useState, useEffect } from "react";
import { ChannelDataType } from "@/types/type";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { baseURL } from "@/lib/functional";
const ChannelRender = async () => {
    const session = await getServerSession(authOptions);
    if (session) {
        const channelDataPromise = fetch(`${baseURL}/api/channel/data?accountId=${session.user.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
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
        return <></>
    }
}

export default ChannelRender