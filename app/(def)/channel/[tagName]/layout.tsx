'use client'
import { ChannelDataType } from "@/type/type";
import Image from "next/image";
import { useEffect, useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import axios from "axios";
import { baseURL } from "@/lib/functional";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase'
type menuItem = {
    name: string,
    href: string,
}

const listMenuItem: menuItem[] = [
    {
        name: 'Trang chủ',
        href: 'home'
    },
    {
        name: 'Video',
        href: 'video'
    },
    {
        name: 'Sự kiện phát trực tiếp',
        href: 'streaming'
    }
]
export default function Layout({ children }: { children: React.ReactNode }) {
    const [tab, setTab] = useState<number>(0);
    const params: { tagName: string } = useParams()

    const router = useRouter()
    const [channelData, setChannelData] = useState<ChannelDataType>()
    const [channelAvatar, setChannelAvatar] = useState<string>('');
    const [channelBanner, setChannelBanner] = useState<string>('');

    useEffect(() => {
        axios.get('/api/channel/data', {
            params: {
                tagName: params.tagName
            }
        }).then(res => setChannelData(res.data))
    }, [])


    useEffect(() => {
        if (channelData) {
            const channelAvatarStorageRef = ref(storage, `/channel/avatars/${channelData?.tagName}`)
            const channelBannerStorageRef = ref(storage, `/channel/banners/${channelData?.tagName}`)
            getDownloadURL(channelAvatarStorageRef).then(url => setChannelAvatar(url));
            getDownloadURL(channelBannerStorageRef).then(url => setChannelBanner(url));
        }

    }, [channelData])



    return (
        <div className="flex flex-1 flex-col overflow-y-scroll gap-5">
            <div className="w-full pt-[15%] relative">
                <Image src={channelBanner} alt="" fill />
            </div>
            <div className="flex gap-4 items-center px-6">
                <div className="relative w-20 h-20">
                    <Image src={channelAvatar} alt="" fill />
                </div>
                <div className="flex flex-col">
                    <p>{channelData?.name}</p>
                    <p>{channelData ? `@${channelData.tagName}` : ''}</p>
                    <p>{channelData?.des}</p>
                </div>
            </div>
            <div className="w-full h-fit overflow-x-scroll flex relative after:absolute after:w-full after:h-[1px] after:bg-slate-400 after:bottom-0 overflow-hidden min-h-[50px]">
                {listMenuItem.map((item, index) => {
                    return <div className={`px-4 py-2 ${tab == index ? 'relative after:absolute after:w-full after:h-[3px] after:bg-cyan-400 after:bottom-0 after:left-0' : ''}`} key={index} onClick={() => { setTab(index); router.push(`/channel/${params.tagName}/${item.href}`) }}>
                        {item.name}
                    </div>
                })}
            </div>

            <div className="h-full">
                {children}
            </div>
        </div>
    )
}