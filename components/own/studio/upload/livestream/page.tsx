'use client'
import VideoJS from '@/components/own/test/VIdeojs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChannelDataType } from '@/types/type';
import axios from 'axios';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react'
import { useCopyToClipboard } from "usehooks-ts";


export default function Page({ session }: { session: Session | null }) {

    const [value, copy] = useCopyToClipboard();

    const [tab, setTab] = useState<number>(0);
    const [channelData, setChannelData] = useState<ChannelDataType>();

    useEffect(() => {
        if (session) {
            axios.get('/api/channel/data', {
                params: {
                    accountId: session.user.id
                }
            }).then(res => {
                setChannelData(res.data)
            })
        }
    })

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
                    <div className='p-4'>
                        <p>Cài đặt nâng cao</p>
                    </div>
                </div>
            )
        } else if (tab == 1) {

        } else if (tab == 2) {

        }
    }

    return (
        <div className="flex">
            {/* config */}
            <div className='p-3 flex flex-col gap-3 bg-[#161616]'>
                <div className="flex flex-col bg-[#1f1f1f] p-4">
                    <div className="flex">
                        <div className="p-3">
                            {channelData && <VideoJS name={channelData.tagName} />}
                        </div>
                        <div className='flex w-max p-3 gap-3'>
                            <div className='w-max'>
                                <label className='flex gap-2 text-lg'>tiêu đề</label>
                                <label className='flex gap-2 text-lg h-30'>mô tả</label>
                                <label className='flex gap-2 text-lg'>chế độ hiển thị</label>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <input className='bg-transparent border-b-2 focus:outline-none focus:border-cyan-200 border-b-slate-600' placeholder="tiêu đề" />
                                <textarea className='resize-none min-w-[300px] h-24 bg-transparent border-b-2 focus:outline-none focus:border-cyan-200 border-b-slate-600' placeholder="mô tả" />
                                <Select>
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
                    <div>Để phát trực tiếp, hãy gửi video của bạn đến FakeTube bằng phần mềm phát trực tiếp</div>
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
            <div>

            </div>

        </div>
    )
}