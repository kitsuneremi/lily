'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChannelDataType, VideoDataType } from "@/type/type";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase'

export default function Page() {


    const [newestVideoData, setNewestVideoData] = useState<VideoDataType>();
    const [channelAvatar, setChannelAvatar] = useState<string>('');
    const [channelData, setChannelData] = useState<ChannelDataType>()
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            axios.get('/api/channel/data', {
                params: {
                    //@ts-ignore
                    accountId: session.user!.id
                }
            }).then(res => setChannelData(res.data))
        }
    }, [session])

    useEffect(() => {
        if(channelData){
            const channelAvatarStorageRef = ref(storage, `/channel/avatars/${channelData.tagName}`)
            getDownloadURL(channelAvatarStorageRef).then(url => setChannelAvatar(url))
        }
    },[channelData])

    return (
        <div className="flex-1 h-[calc(100vh-64px)] overflow-y-scroll ">
            <p className="text-3xl font-extrabold mb-7">Trang tổng quan về kênh</p>
            <div className="grid grid-cols-4 text-center">
                <div>
                    <p>Hiệu suất video mới nhất</p>
                    <div className="">
                        <Image src={channelAvatar} fill alt="" className="min-h-[140px]" />
                    </div>
                    <p>{newestVideoData?.title}</p>
                </div>

                <div>
                    <p>Số liệu phân tích kênh</p>
                </div>

                <div>
                    <p>Bình luận</p>
                </div>

                <div>
                    <p>Người đăng ký</p>
                </div>
            </div>
        </div>
    )
}