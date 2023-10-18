'use client'

import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '@/redux/storage';
import { useMediaQuery, useIsomorphicLayoutEffect } from 'usehooks-ts'
import { close, reverse, open } from '@/redux/features/sidebar-slice';
import { useEffect, useState, useLayoutEffect } from 'react';
import { BsYoutube, BsBell, BsChatLeftDots } from 'react-icons/bs'
import { AiOutlineMenu, AiOutlineClose, AiOutlineRight, AiOutlineLeft, AiOutlineUpload, AiOutlineSearch, AiOutlineHome } from 'react-icons/ai'
import Link from 'next/link';

export default function WatchSidebar(){
    const sidebar = useAppSelector(state => state.sidebarReducer.value.sidebar)
    const dispatch = useDispatch();

    useIsomorphicLayoutEffect(() => {
        dispatch(close())
    }, [])

    const handleResponsive = () => {
        if (sidebar) {
            return (
                <div className='fixed top-16 left-0 w-40 h-full py-3 flex flex-col gap-2 overflow-y-scroll bg-slate-50 z-20'>
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
        <>
            {handleResponsive()}
        </>
    )
}