'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChannelDataType, VideoDataType } from "@/type/type";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase'

import { AiFillLike } from 'react-icons/ai'
import { TfiBarChart } from 'react-icons/tfi'
import { BiCommentDetail } from 'react-icons/bi'

export default function Page() {


    const [videoThumbnail, setVideoThumbnail] = useState<string>('');
    const [channelData, setChannelData] = useState<ChannelDataType>()
    const [latestVideoData, setLatestVideoData] = useState<VideoDataType>()
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
        if (channelData) {
            axios.get('/api/video/channellatest', {
                params: {
                    channelId: channelData.id
                }
            }).then(res => {
                if (res.status) {
                    setLatestVideoData(res.data);
                }
            })
        }
    }, [channelData])


    useEffect(() => {
        if (latestVideoData) {
            const videoThumbnailStorageRef = ref(storage, `/video/thumbnails/${latestVideoData.link}`)
            getDownloadURL(videoThumbnailStorageRef).then(url => setVideoThumbnail(url))
        }
    }, [latestVideoData])

    return (
        <div className="flex-1 h-[calc(100vh-64px)] overflow-y-scroll ">
            <p className="text-3xl font-extrabold mb-7">Trang tổng quan về kênh</p>
            <div className="grid grid-cols-4 text-center">
                <div className="px-4 bg-slate-200 rounded-lg">
                    <p className="text-xl font-bold my-4">Hiệu suất video mới nhất</p>
                    <div className="relative w-full m-2 pt-[56.25%]">
                        <Image src={videoThumbnail} fill alt="" sizes="16/9" />
                    </div>
                    <p className="text-lg font-bold text-center pl-3">{latestVideoData?.title}</p>
                    <div className="flex justify-around">
                        <div className="flex gap-1 items-center">
                            <TfiBarChart />
                            <p>{latestVideoData?.view}</p>
                        </div>
                        <div className="flex gap-1 items-center">
                            <BiCommentDetail />
                            <p>{latestVideoData?.like}</p>
                        </div>
                        <div className="flex gap-1 items-center">
                            <AiFillLike />
                            <p>{latestVideoData?.like}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <p>Số liệu phân tích kênh</p>
                    <div className="flex flex-col">
                        <div className="flex flex-col">
                            <p>Số người đăng ký hiện tại</p>
                            <p>{channelData?.sub}</p>
                        </div>
                    </div>
                    <div className="h-[1px] my-2 w-full relative after:absolute after:w-[90%] after:h-[1px] after:bg-slate-400 after:bottom-0 after:left-[5%]"></div>
                    <div className="flex flex-col">
                        ???
                    </div>
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