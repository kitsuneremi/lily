'use client'
import VideoJS from '@/components/own/test/VIdeojs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/components/ui/use-toast';
import { baseURL } from '@/lib/functional';
import { ChannelDataType, MediaDataType } from '@/types/type';
import axios from 'axios';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react'
import { useCopyToClipboard, useEffectOnce } from "usehooks-ts";
import Link from 'next/link'
import { getSession } from 'next-auth/react';
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";

export default function Page({ session }: { session: Session }) {

    const [value, copy] = useCopyToClipboard();
    const [title, setTitle] = useState<string>('');
    const [des, setDes] = useState<string>('');
    const [mode, setMode] = useState<number>(0);

    const [tab, setTab] = useState<number>(0);
    const [streamData, setStreamData] = useState<MediaDataType | null>();
    const [channelData, setChannelData] = useState<ChannelDataType>();

    const deviceType = {
        isFlex: useMediaQuery("(min-width: 1200px"),
        isAbsolute: useMediaQuery("(max-width: 1199px)"),
    };

    const { toast } = useToast()

    useEffect(() => {
        if (channelData) {
            // setInterval(() => {

            // }, 5000)
            axios.get(`/api/live/data`, {
                params: {
                    tag: channelData.tagName
                }
            }).then(res => {
                setStreamData(res.data)
            }).catch(err => { setStreamData(null) })
        }
    }, [channelData])

    useEffectOnce(() => {
        setInterval(() => {
            axios.get('/api/channel/data', {
                params: {
                    accountId: session?.user.id
                }
            }).then(res => setChannelData(res.data))
        }, 5000)
    })

    useEffect(() => {
        console.log(streamData)
    }, [streamData])

    const tabRender = () => {
        if (tab == 0) {
            return (
                <div className='grid grid-cols-2'>
                    <div className='flex flex-col p-4 gap-3'>
                        <p className='text-lg'>Mã sự kiện trực tiếp</p>
                        <div className=''>
                            <p>Chọn phương thức kết nối trực tiếp</p>
                            <Select defaultValue='0'>
                                <SelectTrigger className="w-full bg-transparent">
                                    <SelectValue placeholder="RTMP" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem defaultChecked value="0">RTMP</SelectItem>
                                    <SelectItem value="1" disabled>HLS (đang phát triển) </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='flex gap-4 items-center w-full justify-between'>
                            <p className='relative w-full after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-slate-600'>{channelData ? `${channelData.tagName}?key=${channelData.streamKey}` : ''}</p>
                            <div className='flex gap-2 flex-shrink-0'>
                                <button className='px-3 py-1 my-1 border-slate-500 border-2'>Đặt lại</button>
                                <button className='px-3 py-1 my-1 border-slate-500 border-2' onClick={() => { channelData ? copy(`${channelData.tagName}?key=${channelData.streamKey}`) : () => { } }}>Sao chép</button>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <p>url máy chủ phát trực tiếp</p>
                            <div className='flex justify-between items-center gap-3'>
                                <p className='relative w-full after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-slate-600'>rtmp://erinasaiyukii.com/live</p>
                                <button className='flex-shrink-0 px-3 py-1 my-1 border-slate-500 border-2' onClick={() => { copy('rtmp://erinasaiyukii.com/live') }}>Sao chép</button>
                            </div>
                        </div>
                    </div>
                    <div className='p-4 flex flex-col gap-4 flex-1'>
                        <p>Cài đặt nâng cao</p>
                        <div className='flex flex-col w-full gap-3'>
                            <div className='flex gap-3'>
                                <label className='flex gap-2 text-lg'>tiêu đề</label>
                                <input value={title} onChange={e => setTitle(e.target.value)} className='bg-transparent flex-1 border-b-2 focus:outline-none focus:border-cyan-200 border-b-slate-600' placeholder="tiêu đề" />
                            </div>
                            <label className='flex gap-2 text-lg'>mô tả</label>
                            <textarea value={des} onChange={e => setDes(e.target.value)} className='resize-none h-24 overflow-hidden w-full bg-transparent border-b-2 focus:outline-none focus:border-cyan-200 border-b-slate-600' placeholder="mô tả" />
                            <div className='flex gap-3'>
                                <label className='flex gap-2 text-lg'>chế độ hiển thị</label>
                                <Select onValueChange={e => setMode(Number.parseInt(e))} defaultValue='0'>
                                    <SelectTrigger className="w-[180px] bg-transparent">
                                        <SelectValue placeholder="Công khai" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem defaultChecked value="0">Công khai</SelectItem>
                                        <SelectItem value="1">Không công khai</SelectItem>
                                        <SelectItem value="2">Riêng tư</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else if (tab == 1) {

        } else if (tab == 2) {

        }
    }

    const handlePostStream = () => {
        if (!streamData) {
            axios.post('/api/live/create', {
                title: title,
                des: des,
                status: mode,
                accountId: session.user.id
            }).then(res => {
                if (res.status == 201) {
                    toast({
                        title: 'ok',
                        description: 'bạn đã tạo buổi phát trực tiếp thành công'
                    })
                } else {
                    toast({
                        title: 'phát luồng trước đã',
                        description: 'chưa tìm thấy luồng phát'
                    })
                }
            })
        }
    }

    const handleUpdateStreamData = () => {
        if (streamData) {
            axios.post('/api/live/update', {
                id: streamData.id,
                title: title,
                des: des,
                status: mode,
                accountId: session.user.id
            }).then(res => {
                if (res.status == 200) {
                    toast({
                        title: 'cập nhật thành công',
                        description: 'cập nhật dữ liệu luồng phát thành công'
                    })
                } else {
                    toast({
                        title: 'phát luồng trước đã',
                        description: 'chưa tìm thấy luồng phát'
                    })
                }
            })
        }
    }

    const handleStreamButton = () => {
        if (channelData) {
            if (channelData.live && streamData) {
                if (streamData.isLive) {
                    return <div className='flex gap-2'>
                        <button className='px-3 py-2 bg-cyan-600' onClick={() => { handleUpdateStreamData() }}>Cập nhật</button>
                        <button className='px-3 py-2 bg-red-600 text-white'>Dừng sự kiện trực tiếp</button>
                    </div>
                } else {
                    return <Link href={`/watch/${streamData?.link}`}>xem lại</Link>
                }
            } else if (channelData.live && streamData === null) {
                return <button className={`px-3 py-2 bg-cyan-400`} onClick={() => { handlePostStream() }}>Phát trực tiếp</button>
            } else if (!channelData.live) {
                return <button className={`px-3 py-2 bg-slate-500`} onClick={() => { handlePostStream() }}>Phát trực tiếp</button>
            }
        }
    }

    if (deviceType.isAbsolute || deviceType.isFlex) {
        return (
            <div className={`flex w-full`}>
                {/* config */}
                <div className='p-3 flex flex-col gap-3 bg-[#161616] w-3/4'>
                    <div className="flex flex-col bg-[#1f1f1f] p-4">
                        <div className="flex">
                            <div className="p-3">
                                {channelData ? <VideoJS name={channelData.tagName} /> : <div className='w-96 pt-[56.25%]'></div>}
                            </div>
                            <div className='grid grid-cols-2 w-max p-3 gap-3'>
                                <p>tiêu đề</p>
                                <p>{streamData?.title}</p>

                                <p>Mô tả</p>
                                <p>{streamData?.des}</p>

                                <p>trạng thái</p>
                                <p>{streamData?.status == 0 ? 'công khai' : streamData?.status == 1 ? 'không công khai' : 'riêng tư'}</p>
                            </div>
                        </div>
                        <div className='flex justify-between items-center'>
                            {channelData ? (channelData.live ? <p>
                                tính năng tắt phát trực tiếp tạm thời chưa có, tắt ở obs đi
                            </p> : <p>Để phát trực tiếp, hãy gửi video của bạn đến FakeTube bằng phần mềm phát trực tiếp như obs, streamlab,...</p>) : <></>}
                            {handleStreamButton()}
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex bg-[#282828]'>
                            <button onClick={() => { setTab(0) }} className={`px-3 py-2 hover:bg-slate-700 ${tab == 0 ? 'relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-slate-500' : ''}`}>Cài đặt sự kiện trực tiếp</button>
                            <button onClick={() => { setTab(1) }} className={`px-3 py-2 hover:bg-slate-700 ${tab == 1 ? 'relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-slate-500' : ''}`}>Số liệu phân tích</button>
                            <button onClick={() => { setTab(2) }} className={`px-3 py-2 hover:bg-slate-700 ${tab == 2 ? 'relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-slate-500' : ''}`}>in progress</button>
                        </div>
                        <div className='bg-[#1f1f1f]'>
                            {tabRender()}
                        </div>
                    </div>
                </div>
                {/* realtime chat */}
                <div className='w-1/4'>
                    real time chat
                </div>

            </div>
        )
    }
}