'use client'
import { BsYoutube, BsBell, BsChatLeftDots } from 'react-icons/bs'
import { AiOutlineMenu, AiOutlineClose, AiOutlineRight, AiOutlineLeft, AiOutlineUpload, AiOutlineSearch } from 'react-icons/ai'

import { useSession } from 'next-auth/react'
import { AppDispatch, useAppSelector } from '@/redux/storage';
import { useDispatch } from 'react-redux'
import { close, reverse, open } from '@/redux/features/sidebar-slice';
import { useMediaQuery } from 'usehooks-ts'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoadingOutlined } from '@ant-design/icons'

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils'

import Image from 'next/image'
import Link from 'next/link'
import { ChannelDataType } from '@/type/type';
import axios from 'axios';
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase'

export default () => {

    const deviceType = {
        isPc: useMediaQuery('(min-width: 1200px'),
        isTablet: useMediaQuery('(min-width:700px) and (max-width: 1199px)'),
        isMobile: useMediaQuery('(max-width: 699px)')
    }

    const dispatch = useDispatch();
    const [responsiveShowing, setResponsiveShowing] = useState(false)
    const router = useRouter()
    const { data: session } = useSession()
    const sidebar = useAppSelector(state => state.sidebarReducer.value.sidebar)

    const [personalChannelData, setPersonalChannelData] = useState<ChannelDataType>();
    const [channelAvatar, setChannelAvatar] = useState<string>('');
    useEffect(() => {
        if (personalChannelData) {
            const channelAvatarStorageRef = ref(storage, `/channel/avatars/${personalChannelData.tagName}`)
            getDownloadURL(channelAvatarStorageRef).then(url => setChannelAvatar(url))
        }
    }, [personalChannelData])

    useEffect(() => {
        if (session && session.user) {
            axios.get('/api/channel/data', {
                params: {
                    //@ts-ignore
                    accountId: session.user.id
                }
            }).then(res => { if (res.status == 200) { setPersonalChannelData(res.data) } })
        }
    }, [session])

    const handleResponsive = () => {
        if (deviceType.isMobile) {
            if (responsiveShowing) {
                //device type: mobile, trạng thái: show search input
                return (
                    <>
                        <button className='text-xl'>
                            <AiOutlineClose onClick={() => setResponsiveShowing(false)} />
                        </button>
                        <div className='flex gap-3'>
                            <div className='lg:hidden'><AiOutlineSearch /></div>
                            <AiOutlineUpload />
                            <BsBell />
                            <BsChatLeftDots />
                        </div>
                    </>
                )
            } else {
                // device type: mobile, trạng thái: ẩn search input
                return (
                    <>
                        <div className='flex gap-5 text-xl'>
                            {sidebar ? <AiOutlineRight onClick={() => { dispatch(reverse()) }} /> : <AiOutlineLeft onClick={() => { dispatch(reverse()) }} />}
                            <Link href={'/'}><button className=''><BsYoutube /></button></Link>
                        </div>
                        <div className='flex gap-3'>
                            <div className='lg:hidden'><AiOutlineSearch /></div>
                            <AiOutlineUpload />
                            <BsBell />
                            <BsChatLeftDots />
                        </div>
                    </>
                )
            }
        } else {
            return (
                // device type: desktop hoặc tablet
                <>
                    <div className='w-40 flex gap-8'>
                        {sidebar
                            ?
                            <div className='text-xl flex items-center cursor-pointer'>
                                <AiOutlineRight
                                    onClick={() => {
                                        dispatch(reverse())
                                    }}
                                />
                            </div>
                            :
                            <div className='text-xl flex items-center cursor-pointer'>
                                <AiOutlineLeft
                                    onClick={() => {
                                        dispatch(reverse())
                                        setResponsiveShowing(!responsiveShowing)
                                    }}
                                />
                            </div>
                        }
                        <Link href={'/'} className='text-xl flex items-center gap-2'><BsYoutube />Lily</Link>
                    </div>
                    <div className='flex gap-1 rounded-2xl border-2 border-black'>
                        <input className='bg-transparent w-60 focus:outline-none ml-3 my-1' />
                        <Separator orientation='vertical' className='m-0 p-0 w-fit' />
                        <div className='h-full w-8 flex flex-col pl-2 justify-center cursor-pointer hover:bg-slate-400 rounded-r-2xl'><AiOutlineSearch /></div>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <div className='lg:hidden text-2xl cursor-pointer'><AiOutlineSearch /></div>
                        <Link href={'/station/upload'}><div className='text-2xl cursor-pointer'><AiOutlineUpload /></div></Link>
                        <div className='text-2xl cursor-pointer'><BsBell /></div>
                        <div className='text-2xl cursor-pointer'><BsChatLeftDots /></div>

                        <Popover>
                            <PopoverTrigger>
                                <Avatar className='w-9 h-9'>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback><LoadingOutlined /></AvatarFallback>
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent>
                                {session && session.user ? <div className='shadow-sm border-[1px] bg-cyan-50'>
                                    {personalChannelData ?
                                        <MenuItem className='bg-white'>
                                            <div className='flex gap-4'>
                                                <div className='flex items-center'>
                                                    <div className='relative w-8 h-8'>
                                                        <Image src={channelAvatar} alt='' fill />
                                                    </div>
                                                </div>
                                                <div className='flex items-center'>
                                                    <p className='text-xl'>{session.user.name}</p>
                                                </div>
                                            </div>
                                        </MenuItem> : <></>}
                                    <MenuItem className=''>
                                        <Link href={'/station'}>
                                            Station
                                        </Link>
                                    </MenuItem>
                                    <Collapsible>
                                        <CollapsibleTrigger className='w-full'><MenuItem className='text-start'>Chế độ sáng</MenuItem></CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <MenuItem className=''>
                                                <div className='flex flex-col w-full px-3 rounded-sm text-start'>
                                                    <button className='text-start py-1'>Sáng</button>
                                                    <button className='text-start py-1'>Tối</button>
                                                    <button className='text-start py-1'>Hệ thống</button>
                                                </div>
                                            </MenuItem>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div> :
                                    <div className='flex flex-col gap-2 shadow-sm'>
                                        <MenuItem className='bg-gradient-to-r from-cyan-200 to-cyan-400'>
                                            <Link href={'/register'}>
                                                Đăng nhập
                                            </Link>
                                        </MenuItem>
                                        <Collapsible>
                                            <CollapsibleTrigger className='w-full'><MenuItem className='text-start'>Chế độ sáng</MenuItem></CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <MenuItem className=''>
                                                    <div className='flex flex-col w-full px-3 rounded-sm text-start'>
                                                        <button className='text-start py-1'>Sáng</button>
                                                        <button className='text-start py-1'>Tối</button>
                                                        <button className='text-start py-1'>Hệ thống</button>
                                                    </div>
                                                </MenuItem>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>
                                }
                            </PopoverContent >
                        </Popover >
                    </div >
                </>
            )
        }
    }

    return (
        <div className='w-screen h-16 flex justify-between fixed top-0 left-0 px-8 py-4 bg-white z-10'>
            {handleResponsive()}
        </div>
    )
}


const MenuItem = ({ children, className, ...props }: { children: React.ReactNode, className: string | undefined }) => {
    return (
        <div className={cn('w-full px-3 py-3 rounded-sm cursor-pointer hover:bg-slate-300', className)} {...props}>
            <p className='w-full select-none'>{children}</p>
        </div>
    )
}