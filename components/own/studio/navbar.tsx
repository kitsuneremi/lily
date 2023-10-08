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
            <div className="flex gap-6">
                <div className='flex items-center' onClick={() => dispatch(reverse())}>
                    <AiOutlineMenu />
                </div>
                <div className='flex items-center gap-3' onClick={() => { redirect('/home') }}>
                    <SiYoutube />
                    Station
                </div>
            </div>
            <div className='flex items-center'>
                <div className='relative w-64'>
                    <div className='border-[1px] border-slate-500 rounded-xl flex items-center w-fit px-2'>
                        <input type='text' ref={searchRef} value={searchValue} onChange={e => setSearchValue(e.target.value)} onFocus={() => (setFocus(true))} onBlur={() => { setFocus(false) }} className='w-64 h-10 px-2 after:absolute after:h-full after:w-[1px] after:bg-slate-900 after:right-0 focus:outline-none' />
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