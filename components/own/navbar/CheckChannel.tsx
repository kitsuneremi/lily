'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import MenuItem from "./MenuItem";
import Image from "next/image";
import axios from 'axios'
import { useState, useEffect, memo } from "react";
import { ChannelDataType } from "@/types/type";
import { useDispatch } from "react-redux";
import { set, fetchChannelData } from '@/redux/features/current-channel-slice'
import { AppDispatch, useAppSelector } from "@/redux/storage";

const ChannelRender = () => {
    const { data: session } = useSession();
    const router = useRouter();
    
    const personalChannelData = useAppSelector((state) => state.channelReducer.value.channelData);
    const [finishRequest, setFinishRequest] = useState<boolean>(personalChannelData ? true : false);

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            if (!personalChannelData) {
                if (session && session.user) {
                    setFinishRequest(false);
                    try {
                        await dispatch(fetchChannelData(session.user.id));
                        setFinishRequest(true);
                    } catch (error) {
                        console.error('Error fetching channel data:', error);
                    }
                }
            }
        };
    
        fetchData();
    }, [session]);
    
    useEffect(() => {
        console.log(personalChannelData)
    },[personalChannelData])

    if (!finishRequest) {
        return (
            <MenuItem className="text-start">
                <Skeleton className="h-full w-full" />
            </MenuItem>
        );
    } else if (finishRequest && session && personalChannelData == null) {
        return (
            <MenuItem
                onClick={() => {
                    router.push("regchannel");
                }}
            >
                Chưa có kênh? Tạo ngay!
            </MenuItem>
        );
    } else if (finishRequest && session && personalChannelData) {
        return (
            <>
                <MenuItem className="bg-transparent">
                    <div className="flex gap-4">
                        <div className="flex items-center">
                            <div className="relative w-8 h-8">
                                {personalChannelData.avatarImage && (
                                    <Image className="rounded-full" src={personalChannelData.avatarImage}
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
                <MenuItem
                    onClick={() => {
                        router.push("station");
                    }}
                >
                    Station
                </MenuItem>
            </>
        );
    }
}

export default memo(ChannelRender)