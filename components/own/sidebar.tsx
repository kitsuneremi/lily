'use client'

import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '@/redux/storage';
import { useMediaQuery, useOnClickOutside } from 'usehooks-ts'
import { close, reverse, open } from '@/redux/features/sidebar-slice';
import { Ref, useEffect, useState, useRef } from 'react';
import { BsYoutube, BsBell, BsChatLeftDots } from 'react-icons/bs'
import { AiOutlineMenu, AiOutlineClose, AiOutlineRight, AiOutlineLeft, AiOutlineUpload, AiOutlineSearch, AiOutlineHome } from 'react-icons/ai'
import Link from 'next/link';
import { Separator } from "@/components/ui/separator"

export default function Sidebar() {
    const sidebarRef = useRef<HTMLDivElement>(null)
    const deviceType = {
        isPc: useMediaQuery('(min-width: 1200px'),
        isTablet: useMediaQuery('(min-width:700px) and (max-width: 1199px)'),
        isMobile: useMediaQuery('(max-width: 699px)')
    }

    const sidebar = useAppSelector(state => state.sidebarReducer.value.sidebar)
    const dispatch = useDispatch();

    useOnClickOutside(sidebarRef, () => { dispatch(close()) })

    useEffect(() => {
        if (deviceType.isMobile) {
            dispatch(close())
        }
    }, [])


    const Item = () => {
        return (
            <Link href={'/'}>
                <div className={`flex justify-center items-center gap-2 w-full rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 py-3 px-5`}>
                    <div className='flex flex-col justify-center'>
                        <AiOutlineHome />
                    </div>
                    <div className={`flex justify-center items-center ${sidebar ? '' : 'hidden'}`}>
                        <p className=''>Home</p>
                    </div>
                </div>
            </Link>
        )
    }

    const handleResponsive = () => {
        if (deviceType.isPc) {
            return (
                <div className='flex flex-col gap-2 w-max overflow-y-scroll hidden-scrollbar px-3'>
                    <Item />
                </div>
            )
        } else if (deviceType.isTablet) {
            return (
                <div className='flex flex-col gap-2 w-max px-3' ref={sidebarRef}>
                    <Item />
                </div>
            )
        } else if (deviceType.isMobile && sidebar) {
            return (
                <div className='absolute w-[200px] top-16 left-0 z-10 h-[calc(100vh-64px)] py-3 flex flex-col gap-2 bg-white' ref={sidebarRef}>
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
        } else if (!sidebar) {
            return (
                <></>
            )
        }
    }

    return (
        <>
            {handleResponsive()}
        </>
    )
} 