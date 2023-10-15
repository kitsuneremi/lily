'use client'
import Image from "next/image"
import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '@/redux/storage';
import { useSession } from "next-auth/react";
import { ReactElement, useEffect, useState } from "react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { FcBullish } from 'react-icons/fc'
import Link from "next/link";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase'
import { ChannelDataType } from "@/type/type";
import axios from "axios";
import { BsUpload } from 'react-icons/bs'
import { authOptions } from "@/lib/auth";

type setting = {
    id: number,
    name: string,
    href: string,
    icon: ReactElement
}

const listSettings: setting[] = [
    {
        id: 0,
        name: 'Trang Tổng Quan',
        href: '/overview',
        icon: <FcBullish />
    },
    {
        id: 1,
        name: 'Nội dung',
        href: '/videos',
        icon: <FcBullish />
    },
    {
        id: 4,
        name: 'Đăng tải',
        href: '/upload',
        icon: <BsUpload />
    },
    {
        id: 2,
        name: 'Số liệu phân tích',
        href: '/analytics',
        icon: <FcBullish />
    },
    {
        id: 3,
        name: 'Bình luận',
        href: '/comment',
        icon: <FcBullish />
    }
]

const Sidebar = () => {

    const sidebar = useAppSelector(state => state.sidebarReducer.value.sidebar)
    const dispatch = useDispatch();
    const { data: session } = useSession({ required: true, onUnauthenticated: () => redirect('/register') });

    const [channelData, setChannelData] = useState<ChannelDataType>();

    const [channelAvatar, setChannelAvatar] = useState<string>()

    const [tab, setTab] = useState<number>(0)

    const url = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (session && session.user) {
            axios.get('/api/channel/data', {
                params: {
                    //@ts-ignore
                    accountId: session?.user.id
                }
            }).then(res => {
                console.log(res)
                setChannelData(res.data)
            }).catch(e => {
                router.push('/regchannel')
            })
        }
    }, [session])

    useEffect(() => {
        if (channelData) {
            const channelAvatarStorageRef = ref(storage, `/channel/avatars/${channelData.tagName}`)
            getDownloadURL(channelAvatarStorageRef).then(url => setChannelAvatar(url))
        }
    }, [channelData])

    useEffect(() => {
        listSettings.map(setting => {
            if (url.includes(setting.href)) {
                setTab(setting.id)
            }
        })
    }, [url])

    return (
        <div className="flex-0">
            <div className="flex flex-col gap-3 px-3 text-center bg-slate-50">
                {channelAvatar ? <Image src={channelAvatar} alt="" className="mx-auto" width={sidebar ? 90 : 30} height={sidebar ? 90 : 30} /> : <></>}
                {sidebar && <p>{channelData?.name}</p>}

            </div>
            <div className="flex flex-col mt-4">
                {listSettings.map((setting, index) => {
                    return (
                        <Link href={`/station${setting.href}`} key={index}>
                            <div className={`flex px-4 py-3 gap-2 bg-slate-100 hover:bg-slate-200 cursor-pointer ${tab === setting.id ? 'relative after:absolute after:w-[90%] after:h-[2px] after:bg-cyan-400 after:bottom-0 after:left-[5%]' : ''}`}>
                                <div className="flex items-center">
                                    {setting.icon}
                                </div>
                                {sidebar && <p className="">{setting.name}</p>}
                            </div>
                        </Link>
                    )
                })}

            </div>
        </div>
    )
}

export default Sidebar

