'use client'
import { AiOutlineMenu } from 'react-icons/ai'
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
                <div className='flex items-center gap-3' onClick={() => {redirect('/home')}}>
                    <SiYoutube />
                    Studio
                </div>
            </div>
            <div className='flex items-center'>
                <div className='relative w-64'>
                    <input type='text' ref={searchRef} value={searchValue} onChange={e => setSearchValue(e.target.value)} onFocus={() => (setFocus(true))} onBlur={() => { setFocus(false) }} className='w-64 h-10 border-[1px] rounded-lg px-2' />
                    <div className='absolute w-96 h-56 top-12 left-[-64px] max-w-[95vw]' ref={searchResultRef}>
                        {focusing ? <div className='flex px-4 py-1 gap-9'>
                            <div className='flex items-center'><BsSearch /></div>
                            <div className='flex items-center flex-1'><p className='m-0 text-ellipsis'>{searchValue}</p></div>
                        </div> : <></>}
                    </div>
                </div>
            </div>

            <div>

            </div>
        </div>
    )
}


export default StudioNavbar