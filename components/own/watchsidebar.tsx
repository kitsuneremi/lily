'use client'

import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '@/redux/storage';
import { useMediaQuery } from 'usehooks-ts'
import { close, reverse, open } from '@/redux/features/sidebar-slice';
import { useEffect, useState } from 'react';
import { BsYoutube, BsBell, BsChatLeftDots } from 'react-icons/bs'
import { AiOutlineMenu, AiOutlineClose, AiOutlineRight, AiOutlineLeft, AiOutlineUpload, AiOutlineSearch, AiOutlineHome } from 'react-icons/ai'
import Link from 'next/link';
import { Separator } from "@/components/ui/separator"

export default function WatchSidebar(){

    const deviceType = {
        isPc: useMediaQuery('(min-width: 1200px'),
        isTablet: useMediaQuery('(min-width:700px) and (max-width: 1199px)'),
        isMobile: useMediaQuery('(max-width: 699px)')
    }

    const sidebar = useAppSelector(state => state.sidebarReducer.value.sidebar)
    const dispatch = useDispatch();
    const [responsiveShowing, setResponsiveShowing] = useState(false)

    useEffect(() => {
        dispatch(close())
    }, [])

    const handleResponsive = () => {
        if (sidebar) {
            return (
                <div className='absolute top-0 left-0 w-fit py-3 flex flex-col gap-2 overflow-y-scroll' style={{ width: sidebar ? '160px' : '100px' }}>
                    <Link href={'/'}>
                        <div className='flex justify-around w-full hover:bg-slate-200 py-3 px-2'>
                            <div className='flex flex-col justify-center'>
                                <AiOutlineHome />
                            </div>
                            {sidebar ? <p>Home</p> : <></>}
                        </div>
                    </Link>
                    <Link href={'/'}>
                        <div className='flex justify-around w-full hover:bg-slate-200 py-3 px-2'>
                            <div className='flex flex-col justify-center'>
                                <AiOutlineHome />
                            </div>
                            {sidebar ? <p>Home</p> : <></>}
                        </div>
                    </Link>
                    <Link href={'/'}>
                        <div className='flex justify-around w-full hover:bg-slate-200 py-3 px-2'>
                            <div className='flex flex-col justify-center'>
                                <AiOutlineHome />
                            </div>
                            {sidebar ? <p>Home</p> : <></>}
                        </div>
                    </Link>
                    <Link href={'/'}>
                        <div className='flex justify-around w-full hover:bg-slate-200 py-3 px-2'>
                            <div className='flex flex-col justify-center'>
                                <AiOutlineHome />
                            </div>
                            {sidebar ? <p>Home</p> : <></>}
                        </div>
                    </Link>
                </div>
            )
        } else {
            return (
                <></>
            )
        }
    }

    return (
        <div className='h-full relative bg-white'>
            {handleResponsive()}
        </div>
    )
}