'use client'
import { AiOutlineMenu, AiOutlineSearch } from 'react-icons/ai'
import { SiYoutube } from 'react-icons/si'
import { useEffect, useRef, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { useOnClickOutside } from 'usehooks-ts'
import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '@/redux/storage';
import { reverse } from '@/redux/features/sidebar-slice'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const StudioNavbar = () => {
    const searchRef = useRef<HTMLInputElement>(null)
    const searchResultRef = useRef<HTMLDivElement>(null)
    const [searchValue, setSearchValue] = useState<string>('')

    const [focusing, setFocus] = useState<boolean>(false)
    const [visible, setVisible] = useState<boolean>(false)
    useOnClickOutside(searchResultRef, () => {
        if (!focusing) {
            setVisible(false)
        } else {
            setVisible(true)
        }
    })

    useEffect(() => {
        setVisible(focusing)
    }, [focusing])


    const dispatch = useDispatch();


    return (
        <div className="flex justify-between px-3 h-16">
            <div className="flex gap-6 select-none">
                <div className='flex items-center ml-2' onClick={() => dispatch(reverse())}>
                    <AiOutlineMenu />
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Link href={'/'} className='text-xl flex items-center gap-2'>
                                <div className='relative w-5 h-5 lg:w-9 lg:h-9'>
                                    <Image className='rounded-full animate-spin' src={'https://danviet.mediacdn.vn/upload/2-2019/images/2019-04-02/Vi-sao-Kha-Banh-tro-thanh-hien-tuong-dinh-dam-tren-mang-xa-hoi-khabanh-1554192528-width660height597.jpg'} fill sizes='1/1' alt='khá bảnh' />
                                </div>
                                <p>Station</p>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Quay về trang chủ</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className='flex items-center'>
                <div className='relative w-64'>
                    <div className='border-[1px] rounded-full flex items-center w-fit px-2 dark:bg-slate-800'>
                        <input type='text' ref={searchRef} value={searchValue} onChange={e => setSearchValue(e.target.value)} onFocus={() => (setFocus(true))} onBlur={() => { setFocus(false) }} className='w-64 h-10 px-2 after:absolute after:h-full after:w-[1px] bg-transparent after:bg-slate-900 after:right-0 focus:outline-none' />
                        <div className='text-2xl'><AiOutlineSearch /></div>
                    </div>
                    {focusing ? <div className='absolute w-96 h-fit top-12 left-[-64px] max-w-[95vw] bg-white dark:bg-slate-600 border-[1px] border-slate-400 rounded-lg' ref={searchResultRef}>
                        <div className='flex px-4 py-1 gap-9 h-max items-center'>
                            <div className='flex items-center'>
                                <BsSearch />
                            </div>
                            <div className='flex items-center flex-1'>
                                <p className='m-0 w-full text-ellipsis break-words'>{searchValue}</p>
                            </div>
                        </div>
                    </div> : <></>}
                </div>
            </div>

            <div>

            </div>
        </div>
    )
}


export default StudioNavbar