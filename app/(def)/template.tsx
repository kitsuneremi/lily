'use client'
import { useMediaQuery, useOnClickOutside, useEffectOnce } from 'usehooks-ts'
import React, { Ref, useEffect, useState, useRef, Suspense } from 'react';
import { BsYoutube, BsBell, BsChatLeftDots } from 'react-icons/bs'
import { AiOutlineMenu, AiOutlineClose, AiOutlineRight, AiOutlineLeft, AiOutlineUpload, AiOutlineSearch, AiOutlineHome } from 'react-icons/ai'
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react'
import { Separator } from "@/components/ui/separator"
import { LoadingOutlined } from '@ant-design/icons'
import { cn } from '@/lib/utils'
import Image from 'next/image'
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
import { useSsr } from 'usehooks-ts'

export default function Template({ children }: { children: React.ReactNode }) {

    const { data: session } = useSession();
    const { setTheme, theme } = useTheme();
    const { isBrowser } = useSsr();

    const searchResultRef = useRef<HTMLDivElement>(null);
    const popoverTriggerRef = useRef<HTMLDivElement>(null);
    const popoverContentRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null)

    const [personalChannelData, setPersonalChannelData] = useState<ChannelDataType>();
    const [channelAvatar, setChannelAvatar] = useState<string>('');
    const [searchValue, setSearchValue] = useState<string>('');
    const [focusing, setFocus] = useState<boolean>(false);
    const [mobileShowSearch, setMobileShowSearch] = useState<boolean>(false)
    const [showPopover, setShowPopover] = useState<{ click: boolean, menuFocus: boolean }>({ click: false, menuFocus: false });
    const [show, setShow] = useState<boolean>(false);
    const [openSidebar, setOpenSidebar] = useState<boolean>()

    const deviceType = {
        isPc: useMediaQuery('(min-width: 1200px'),
        isTablet: useMediaQuery('(min-width:700px) and (max-width: 1199px)'),
        isMobile: useMediaQuery('(max-width: 699px)')
    }

    useOnClickOutside(popoverTriggerRef, () => { setTimeout(() => setShowPopover(prev => { return { click: false, menuFocus: prev.menuFocus } }), 200) })
    useOnClickOutside(popoverContentRef, () => { setTimeout(() => setShowPopover(prev => { return { click: prev.click, menuFocus: false } }), 200) })
    useOnClickOutside(sidebarRef, () => { setOpenSidebar(false) })
    useEffectOnce(() => {
        if (deviceType.isMobile) {
            setOpenSidebar(false)
        } else {
            setOpenSidebar(true)
        }
    })

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


    const Item = ({ name, href, icon }: { name: string, href: string, icon: React.ReactElement }) => {
        return (
            <Link href={href}>
                <div className={`flex justify-center items-center gap-2 w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-3 px-5`}>
                    <div className='flex flex-col justify-center'>
                        {icon}
                    </div>
                    <div className={`flex justify-center items-center ${openSidebar ? '' : 'hidden'}`}>
                        <p className=''>{name}</p>
                    </div>
                </div>
            </Link>
        )
    }

    const navbar = () => {
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
                        <div className='flex gap-5 text-xl items-center' onClick={() => { setOpenSidebar(prev => !prev) }}>
                            {openSidebar ? <AiOutlineRight /> : <AiOutlineLeft />}
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
                    <div className='w-40 flex gap-8 select-none'>
                        <div className='text-xl flex items-center cursor-pointer' onClick={() => { setOpenSidebar(openSidebar == true ? false : true) }}>
                            {openSidebar ? <AiOutlineRight /> : <AiOutlineLeft />}
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Link href={'/'} className='text-xl flex items-center gap-2'>
                                        <div className='relative w-5 h-5 lg:w-9 lg:h-9'>
                                            <Image className='rounded-full animate-spin' src={'https://danviet.mediacdn.vn/upload/2-2019/images/2019-04-02/Vi-sao-Kha-Banh-tro-thanh-hien-tuong-dinh-dam-tren-mang-xa-hoi-khabanh-1554192528-width660height597.jpg'} fill sizes='1/1' alt='khá bảnh' />
                                        </div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Quay về trang chủ</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                    </div>
                    <div className='relative flex gap-1 items-center rounded-2xl shadow-[0_0_2px_black] dark:bg-slate-800'>
                        <div className='w-max flex items-center h-full'>
                            <input className='bg-transparent pr-1 w-60 focus:outline-none ml-3 my-1' onChange={e => { setSearchValue(e.target.value) }} onFocus={() => { setFocus(true) }} onBlur={() => setFocus(false)} />
                            <div className='w-[2px] h-full relative after:absolute after:bg-slate-300 after:h-[90%] after:top-[5%] after:left-0 after:w-full' />
                            <div className='h-full w-8 flex flex-col pl-2 justify-center cursor-pointer hover:bg-slate-400 dark:hover:bg-slate-300 text-[#020817] dark:text-[white] rounded-r-2xl'><AiOutlineSearch /></div>
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

    const lightModeSetting = () => {

        return (
            <Collapse
                trigger={
                    <MenuItem className='text-start'>Chế độ sáng</MenuItem>
                } content={
                    <div className='flex flex-col w-full rounded-sm text-start'>
                        <button onClick={() => { setTheme('light') }} className='text-start py-1 pl-5 hover:bg-slate-200 rounded-md'>Sáng</button>
                        <button onClick={() => { setTheme('dark') }} className='text-start py-1 pl-5 hover:bg-slate-600 rounded-md hover:text-white'>Tối</button>
                        <button onClick={() => { setTheme('system') }} className='text-start py-1 pl-5 hover:bg-gradient-to-r from-slate-200 to-slate-600 rounded-md hover:text-white'>Hệ thống</button>
                    </div>
                }
            />
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
                        (showPopover.click || showPopover.menuFocus) &&
                        <div className='absolute w-max top-9 right-0 h-fit' ref={popoverContentRef} onClick={() => { setShowPopover({ click: false, menuFocus: true }) }}>
                            <Suspense fallback={<div>waitingg....</div>}>
                                {session?.user ?
                                    <div className='shadow-[0_0_5px_purple] p-3 bg-white dark:bg-[#020817]'>
                                        {personalChannelData ?
                                            <MenuItem className='bg-transparent'>
                                                <div className='flex gap-4'>
                                                    <div className='flex items-center'>
                                                        <div className='relative w-8 h-8'>
                                                            <Image className='rounded-full' src={channelAvatar} alt='' fill sizes='1/1' />
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
                                        {lightModeSetting()}
                                        <MenuItem className='text-start'><div onClick={() => { signOut({ redirect: true, callbackUrl: '/register' }) }}>Đăng xuất</div></MenuItem>
                                    </div>
                                    :
                                    <div className='flex flex-col gap-2 shadow-[0_0_5px_purple] p-3 rounded-lg bg-white dark:bg-[#020817]'>
                                        <MenuItem className='bg-gradient-to-r from-cyan-200 to-cyan-400 dark:from-cyan-400 dark:to-cyan-200 dark:hover:from-cyan-600 dark:hover:to-cyan-300 hover:bg-gradient-to-l hover:from-cyan-300 hover:to-cyan-600'>
                                            <Link href={'/register'}>
                                                Đăng nhập
                                            </Link>
                                        </MenuItem>
                                        {lightModeSetting()}
                                    </div>
                                }
                            </Suspense>
                        </div >
                    }
                </div >

            </>
        )
    }


    const sidebar = () => {
        const res = () => {
            if (isBrowser) {
                if (deviceType.isPc && openSidebar !== undefined) {
                    return (
                        <div className='flex flex-col gap-2 w-max overflow-y-scroll items-start hidden-scrollbar px-3'>
                            <Item icon={<AiOutlineHome />} name='trang chủ' href='/' />
                            <Item icon={<AiOutlineHome />} name='thư viện' href='/libary' />
                            <Item icon={<AiOutlineHome />} name='đã thích' href='/like' />
                            <Item icon={<AiOutlineHome />} name='đã xem' href='/abc' />
                        </div>
                    )
                } else if (deviceType.isTablet && openSidebar !== undefined) {
                    return (
                        <div className='flex flex-col gap-2 w-max px-3 items-start' ref={sidebarRef}>
                            <Item icon={<AiOutlineHome />} name='trang chủ' href='/' />
                            <Item icon={<AiOutlineHome />} name='thư viện' href='/libary' />
                            <Item icon={<AiOutlineHome />} name='đã thích' href='/like' />
                            <Item icon={<AiOutlineHome />} name='đã xem' href='/abc' />
                        </div>
                    )
                } else if (deviceType.isMobile && openSidebar == true && openSidebar !== undefined) {
                    return (
                        <div className='fixed w-[200px] top-16 left-0 z-10 h-[calc(100vh-64px)] py-3 flex flex-col gap-2 bg-white dark:bg-slate-800' ref={sidebarRef}>
                            <Link href={'/'}>
                                <div className='flex justify-around w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-3 px-2 items-center'>
                                    <div className='flex flex-col justify-center'>
                                        <AiOutlineHome />
                                    </div>
                                    <p className='min-w-[100px]'>Home</p>
                                </div>
                            </Link>
                        </div>
                    )
                } else if (openSidebar == false) {
                    return (
                        <></>
                    )
                }
            }
        }

        return (
            <Suspense fallback={<div>loading...</div>}>
                {isBrowser ? res() : <></>}
            </Suspense>
        )

    }

    return (
        <div className='w-full flex flex-col h-screen'>
            <div className='w-screen h-16 flex justify-between fixed top-0 left-0 px-3 lg:px-8 py-4 bg-white dark:bg-[#020817] z-10'>
                {navbar()}
            </div>
            <div className='flex mt-16 h-[calc(100vh-64px)] overflow-y-clip'>
                {sidebar()}
                {children}
            </div>
        </div>
    )
}

const MenuItem = ({ children, className, ...props }: { children: React.ReactNode, className: string | undefined }) => {
    return (
        <div className={cn('w-full px-3 py-3 rounded-sm cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700', className)} {...props}>
            <p className='w-full min-w-[160px] select-none'>{children}</p>
        </div>
    )
}