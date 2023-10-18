'use client'
import { redirect, usePathname } from "next/navigation";
import { useState, useEffect } from 'react'
import Link from "next/link";


import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


type itemType = {
    id: number,
    name: string,
    href: string,
    des: undefined | string
}



const Menu: itemType[] = [
    {
        id: 0,
        name: 'Tài khoản',
        href: '/setting/account',
        des: 'cài đặt tài khoản'
    },
    {
        id: 1,
        name: 'Thông báo',
        href: '/setting/notification',
        des: 'cài đặt thông báo'
    },
    {
        id: 2,
        name: 'Chức năng phát',
        href: '/setting/playback',
        des: 'cài đặt chức năng phát lại'
    },
    {
        id: 3,
        name: 'Nội dung tải xuống',
        href: '/setting/download',
        des: 'cài đặt tải xuống'
    },
    {
        id: 4,
        name: 'Quyền riêng tư',
        href: '/setting/privacy',
        des: 'cài đặt về điều khoản và quyền riêng tư'
    },
    {
        id: 5,
        name: 'Nâng cao',
        href: '/setting/advance',
        des: 'cài đặt nâng cao'
    }
]


export default function Sidebar() {

    const pathName = usePathname();
    const [tab, setTab] = useState<number>(0);

    useEffect(() => {
        const find = Menu.find(item => item.href === pathName);
        if(find){
            setTab(find.id);
        }else{
            redirect('/setting/account')
        }
    }, [pathName])

    return (
        <div className="w-max flex-grow-0 h-[100vh-64px] bg-white flex flex-col gap-2 px-2">
            {
                Menu.map((item, index) => {
                    return <Link href={item.href} key={index}>
                        <div className={`${tab === item.id ? 'bg-cyan-200' : ''} hover:bg-slate-300 px-2 py-3 rounded-md`} onClick={() => { setTab(item.id) }}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>{item.name}</TooltipTrigger>
                                    <TooltipContent align="center" side="bottom">
                                        <p>{item.des}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                        </div>
                    </Link>
                })
            }
        </div>
    )
}