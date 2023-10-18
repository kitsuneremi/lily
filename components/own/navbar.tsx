'use client'
import { BsYoutube, BsBell, BsChatLeftDots } from 'react-icons/bs'
import { AiOutlineMenu, AiOutlineClose, AiOutlineRight, AiOutlineLeft, AiOutlineUpload, AiOutlineSearch } from 'react-icons/ai'

import { signOut, useSession } from 'next-auth/react'
import { AppDispatch, useAppSelector } from '@/redux/storage';
import { useDispatch } from 'react-redux'
import { close, reverse, open } from '@/redux/features/sidebar-slice';
import { useMediaQuery, useOnClickOutside } from 'usehooks-ts'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { Separator } from "@/components/ui/separator"
import { LoadingOutlined } from '@ant-design/icons'
import { cn } from '@/lib/utils'

import Image from 'next/image'
import Link from 'next/link'
import { ChannelDataType } from '@/type/type';
import axios from 'axios';
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase'

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTheme } from "next-themes";


export default function Navbar() {

    const deviceType = {
        isPc: useMediaQuery('(min-width: 1200px'),
        isTablet: useMediaQuery('(min-width:700px) and (max-width: 1199px)'),
        isMobile: useMediaQuery('(max-width: 699px)')
    }

    const dispatch = useDispatch();
    const router = useRouter()
    const { data: session } = useSession();
    const sidebar = useAppSelector(state => state.sidebarReducer.value.sidebar);
    const { setTheme, theme } = useTheme();

    const searchResultRef = useRef<HTMLDivElement>(null);
    const popoverTriggerRef = useRef<HTMLDivElement>(null);
    const popoverContentRef = useRef<HTMLDivElement>(null);

    const [responsiveShowing, setResponsiveShowing] = useState(false)
    const [personalChannelData, setPersonalChannelData] = useState<ChannelDataType>();
    const [channelAvatar, setChannelAvatar] = useState<string>('');
    const [searchValue, setSearchValue] = useState<string>('');
    const [focusing, setFocus] = useState<boolean>(false);
    const [mobileShowSearch, setMobileShowSearch] = useState<boolean>(false)
    const [showPopover, setShowPopover] = useState<{ click: boolean, menuFocus: boolean }>({ click: false, menuFocus: false });
    const [show, setShow] = useState<boolean>(false);


    useOnClickOutside(popoverTriggerRef, () => { setTimeout(() => setShowPopover(prev => { return { click: false, menuFocus: prev.menuFocus } }), 200) })
    useOnClickOutside(popoverContentRef, () => { setTimeout(() => setShowPopover(prev => { return { click: prev.click, menuFocus: false } }), 200) })

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
            }).then(res => { if (res.status == 200) { setPersonalChannelData(res.data) } }).catch(e => { console.log(e) })
        }
    }, [session])

    const handleResponsive = () => {
        if (deviceType.isMobile) {
            if (mobileShowSearch) {
                //device type: mobile, trạng thái: show search input
                return (
                    <>
                        <button className='text-xl'>
                            <AiOutlineClose onClick={() => { setMobileShowSearch(false) }} />
                        </button>

                        <div className='relative flex gap-1 items-center rounded-2xl border-2 border-black'>
                            <div className='w-max flex gap-1 items-center'>
                                <input className='bg-transparent w-40 focus:outline-none ml-3 my-1' onChange={e => { setSearchValue(e.target.value) }} onFocus={() => { setFocus(true) }} onBlur={() => setFocus(false)} />
                                <Separator orientation='vertical' className='m-0 p-0 w-fit' />
                                <div className='h-full w-8 flex flex-col pl-2 justify-center cursor-pointer hover:bg-slate-400 rounded-r-2xl'><AiOutlineSearch /></div>
                            </div>

                            {focusing ? <div className='absolute w-80 h-fit left-[-16px] items-center top-12 max-w-[90vw] bg-white dark:bg-slate-600 border-[1px] border-slate-400 rounded-lg' ref={searchResultRef}>
                                <div className='flex px-4 py-1 gap-2 h-max items-center'>
                                    <div className='flex items-center'>
                                        <AiOutlineSearch />
                                    </div>
                                    <div className='flex items-center flex-1 h-fit'>
                                        <p className='w-full text-lg text-ellipsis break-words h-max'>{searchValue}</p>
                                    </div>
                                </div>
                            </div> : <></>}
                        </div>

                        <div className='flex gap-3 items-center'>
                            <AiOutlineUpload />
                            <BsBell />
                            <BsChatLeftDots />
                            <DropMenu />
                        </div>
                    </>
                )
            } else {
                // device type: mobile, trạng thái: ẩn search input
                return (
                    <>
                        <div className='flex gap-5 text-xl items-center'>
                            {sidebar ? <AiOutlineRight onClick={() => { dispatch(reverse()) }} /> : <AiOutlineLeft onClick={() => { dispatch(reverse()) }} />}
                            <Link href={'/'}><button className='flex gap-2 items-center'>Lily</button></Link>
                        </div>
                        <div className='flex gap-3 items-center'>
                            <div className='lg:hidden' onClick={() => { setMobileShowSearch(true) }}><AiOutlineSearch /></div>
                            <AiOutlineUpload />
                            <BsBell />
                            <BsChatLeftDots />
                            <DropMenu />
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
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Link href={'/'} className='text-xl flex items-center gap-2'><BsYoutube />Lily</Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Quay về trang chủ</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                    </div>
                    <div className='relative flex gap-1 items-center rounded-2xl border-2 border-black'>
                        <div className='w-max flex gap-1 items-center'>
                            <input className='bg-transparent w-60 focus:outline-none ml-3 my-1' onChange={e => { setSearchValue(e.target.value) }} onFocus={() => { setFocus(true) }} onBlur={() => setFocus(false)} />
                            <Separator orientation='vertical' className='m-0 p-0 w-fit' />
                            <div className='h-full w-8 flex flex-col pl-2 justify-center cursor-pointer hover:bg-slate-400 rounded-r-2xl'><AiOutlineSearch /></div>
                        </div>

                        {focusing ? <div className='absolute w-80 h-fit left-[-16px] items-center top-12 max-w-[95vw] bg-white dark:bg-slate-600 border-[1px] border-slate-400 rounded-lg' ref={searchResultRef}>
                            <div className='flex px-4 py-1 gap-9 h-max items-center'>
                                <div className='flex items-center'>
                                    <AiOutlineSearch />
                                </div>
                                <div className='flex items-center flex-1 h-fit'>
                                    <p className='w-full text-lg text-ellipsis break-words h-max'>{searchValue}</p>
                                </div>
                            </div>
                        </div> : <></>}
                    </div>
                    <div className='flex gap-3 items-center'>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Link href={'/station/upload'}><div className='text-2xl cursor-pointer'><AiOutlineUpload /></div></Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Đăng tải nội dung</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className='text-2xl cursor-pointer'><BsBell /></div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Thông báo (phát triển trong tương lai)</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className='text-2xl cursor-pointer'><BsChatLeftDots /></div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Trò chuyện (đã có nhưng chưa cho vào chạy)</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <DropMenu />

                    </div >
                </>
            )
        }
    }

    const Collapse = ({ trigger, content }: { trigger: React.ReactNode, content: React.ReactNode }) => {
        return (
            <div className='flex flex-col gap-1 w-max group/box' onMouseEnter={() => { setShow(true) }} onMouseLeave={() => { setShow(false) }}>
                <div>
                    {trigger}
                </div>
                {/* hidden group-hover/box:block hover:bg-transparent hover:block */}
                {show && <div className=''>
                    {content}
                </div>}
            </div>
        )

    }

    const DropMenu = () => {
        return (
            <>
                <div className='relative'>
                    <div className='w-6 h-6 lg:w-8 lg:h-8 relative shadow-sm' onClick={() => { setShowPopover(prev => { return { click: !prev.click, menuFocus: false } }) }} ref={popoverTriggerRef}>
                        <Image src={'https://github.com/shadcn.png'} className='rounded-full' fill sizes='1/1' alt='' />
                    </div>
                    {
                        (showPopover.click || showPopover.menuFocus) && <div className='absolute w-max top-9 right-0 h-fit' ref={popoverContentRef} onClick={() => { console.log('menu clicked'); setShowPopover({ click: false, menuFocus: true }) }}>
                            {session && session.user ?
                                <div className='shadow-sm border-[1px] bg-cyan-50'>
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
                                    {
                                        personalChannelData ?
                                            <MenuItem className=''>
                                                <Link href={'/station'}>
                                                    Station
                                                </Link>
                                            </MenuItem> :
                                            <MenuItem className=''>
                                                <Link href={'/regchannel'}>
                                                    Chưa có kênh? Tạo ngay!
                                                </Link>
                                            </MenuItem>
                                    }
                                    <Collapse
                                        trigger={
                                            <MenuItem className='text-start'>Chế độ sáng</MenuItem>
                                        } content={
                                            <div className='flex flex-col w-full px-3 rounded-sm text-start bg-red-300'>
                                                <button className='text-start py-1' onClick={() => { setTheme('light') }}>Sáng</button>
                                                <button className='text-start py-1' onClick={() => { setTheme('dark') }}>Tối</button>
                                                <button className='text-start py-1' onClick={() => { setTheme('system') }}>Hệ thống</button>
                                            </div>
                                        }
                                    />
                                    <MenuItem className='text-start'><div onClick={() => { signOut({ redirect: true, callbackUrl: '/register' }) }}>Đăng xuất</div></MenuItem>
                                </div>
                                :
                                <div className='flex flex-col gap-2 shadow-sm'>
                                    <MenuItem className='bg-gradient-to-r from-cyan-200 to-cyan-400 hover:from-cyan-300 hover:to-cyan-600'>
                                        <Link href={'/register'}>
                                            Đăng nhập
                                        </Link>
                                    </MenuItem>
                                    <Collapse
                                        trigger={
                                            <MenuItem className='text-start'>Chế độ sáng</MenuItem>
                                        } content={
                                            <div className='flex flex-col w-full rounded-sm text-start'>
                                                <button className='text-start py-1 pl-5 hover:bg-slate-200 rounded-md'>Sáng</button>
                                                <button className='text-start py-1 pl-5 hover:bg-slate-600 rounded-md hover:text-white'>Tối</button>
                                                <button className='text-start py-1 pl-5 hover:bg-gradient-to-r from-slate-200 to-slate-600 rounded-md hover:text-white'>Hệ thống</button>
                                            </div>
                                        }
                                    />
                                </div>
                            }
                        </div >
                    }
                </div >

            </>
        )
    }

    return (
        <div className='w-screen h-16 flex justify-between fixed top-0 left-0 px-3 lg:px-8 py-4 bg-white z-10'>
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

