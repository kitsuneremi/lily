'use client'
import { BsYoutube, BsBell, BsChatLeftDots } from 'react-icons/bs'
import { AiOutlineMenu, AiOutlineClose, AiOutlineRight, AiOutlineLeft, AiOutlineUpload, AiOutlineSearch } from 'react-icons/ai'
import Link from 'next/link'

import { useSession } from 'next-auth/react'
import { AppDispatch, useAppSelector } from '@/redux/storage';
import { useDispatch } from 'react-redux'
import { close, reverse, open } from '@/redux/features/sidebar-slice';
import { useMediaQuery } from 'usehooks-ts'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Separator } from "@/components/ui/separator"


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

    const ActionIsLogged = () => {
        if (session && session.user) {
            return (
                <div className='flex gap-3'>
                    {deviceType.isPc ? <AiOutlineSearch /> : <></>}
                    <AiOutlineUpload />
                    <BsBell />
                    <BsChatLeftDots />
                </div>
            )
        } else {
            return (<Link href={'/register'}>
                <button>
                    reg
                </button>
            </Link>)
        }

    }

    const handleResponsive = () => {
        if (deviceType.isMobile) {
            if (responsiveShowing) {
                //device type: mobile, trạng thái: show search input
                return (
                    <>
                        <button>
                            <AiOutlineClose onClick={() => setResponsiveShowing(false)} />
                        </button>
                        {ActionIsLogged()}
                    </>
                )
            } else {
                // device type: mobile, trạng thái: ẩn search input
                return (
                    <>
                        <div className='flex gap-5'>
                            {sidebar ? <AiOutlineRight onClick={() => { dispatch(reverse()) }} /> : <AiOutlineLeft onClick={() => { dispatch(reverse()) }} />}
                            <Link href={'/'}><button className=''><BsYoutube/></button></Link>
                        </div>
                        {ActionIsLogged()}
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
                            <AiOutlineRight
                                onClick={() => {
                                    dispatch(reverse())
                                }}
                            />
                            :
                            <AiOutlineLeft
                                onClick={() => {
                                    dispatch(reverse())
                                    setResponsiveShowing(!responsiveShowing)
                                }}
                            />}
                        <Link href={'/'}><BsYoutube /></Link>
                    </div>
                    <div className='flex gap-1 rounded-2xl border-2 border-black'>
                        <input className='bg-transparent w-60 focus:outline-none ml-3 my-1' />
                        <Separator orientation='vertical' className='m-0 p-0 w-fit'/>
                        <div className='h-full w-8 flex flex-col pl-2 justify-center cursor-pointer hover:bg-slate-400 rounded-r-2xl'><AiOutlineSearch/></div>
                    </div>
                    {ActionIsLogged()}
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