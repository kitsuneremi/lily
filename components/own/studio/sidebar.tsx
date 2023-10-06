'use client'
import Image from "next/image"
import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '@/redux/storage';
import { useSession } from "next-auth/react";
import { ReactElement, useEffect } from "react";
import { redirect } from "next/navigation";
import { FcBullish } from 'react-icons/fc'
import Link from "next/link";

type setting = {
    name: string,
    href: string,
    icon: ReactElement
}

const listSettings: setting[] = [
    {
        name: 'Trang Tổng Quan',
        href: '/',
        icon: <FcBullish />
    },
    {
        name: 'Nội dung',
        href: '/videos',
        icon: <FcBullish />
    }, {
        name: 'Số liệu phân tích',
        href: '/analytics',
        icon: <FcBullish />
    },
    {
        name: 'Bình luận',
        href: '/comment',
        icon: <FcBullish />
    }
]

const Sidebar = () => {

    const sidebar = useAppSelector(state => state.sidebarReducer.value.sidebar)
    const dispatch = useDispatch();
    const { data: session } = useSession();

    // useEffect(() => {
    //     if (session == null) {
    //         redirect('/register')
    //     }
    // }, [session])

    return (
        <div className="flex-0">
            <div className="flex flex-col gap-3 px-3 text-center">
                <Image src={''} alt="" className="mx-auto" width={sidebar ? 90 : 30} height={sidebar ? 90 : 30} />
                {sidebar && <p>{session?.user?.name}</p>}

            </div>
            <div className="flex flex-col mt-4">
                {listSettings.map((setting, index) => {
                    return (
                        <Link href={`/studio${setting.href}`}>
                            <div key={index} className="flex px-4 py-3 gap-2 hover:bg-slate-200 cursor-pointer">
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

