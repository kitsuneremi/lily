'use client'
import Image from "next/image"
import { useState, useCallback } from "react"
import { useDropzone, Accept } from 'react-dropzone'

import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';

import { uploadBytes, ref } from 'firebase/storage'
import { storage } from '@/lib/firebase'
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link";



const { Dragger } = Upload;




export default function Page() {

    const [name, setName] = useState<string>('')
    const [tagName, setTagName] = useState<string>('')

    const [originalAvatar, setOriginalAvatar] = useState<File>();
    const [originalThumbnail, setOriginalThumbnail] = useState<File>();
    const [accept, setAccept] = useState<boolean>(false)



    const onAvatarDrop = useCallback((acceptedFiles: File[]) => {
        setOriginalAvatar(acceptedFiles[0])
    }, [])

    const onThumbnailDrop = useCallback((acceptedFiles: File[]) => {
        setOriginalThumbnail(acceptedFiles[0])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onAvatarDrop,
        accept: {
            'image/*': []
        },
        maxFiles: 1,
        multiple: false
    })

    const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps, isDragActive: isThumbnailDragActive } = useDropzone({
        onDrop: onThumbnailDrop,
        accept: {
            'image/*': []
        },
        maxFiles: 1,
        multiple: false
    })


    const handleFinish = () => {
        if (originalAvatar && originalThumbnail) {
            const avatarStorageRef = ref(storage, `/channel/avatars/${tagName}`)
            const bannerStorageRef = ref(storage, `/channel/banners/${tagName}`)
            uploadBytes(avatarStorageRef, originalAvatar)
            uploadBytes(bannerStorageRef, originalThumbnail)

        }
    }


    return (
        <div className="flex flex-col lg:flex-row px-12 pt-12 mt-16">
            <div className="w-full lg:w-1/3 px-3">
                <div className="flex flex-col gap-3">
                    <p className="text-3xl font-semibold">Điền thông tin</p>
                    <div className="grid xl:grid-cols-2 gap-3 lg:grid-cols-1 md:grid-cols-2 grid-cols-1">
                        <label className="w-full flex gap-2 whitespace-nowrap">
                            Tên kênh
                            <input className="relative flex-1 w-32 border-b-2 border-slate-600 focus:border-slate-800 outline-none" value={name} onChange={e => { if (e.target.value.length < 20) { setName(e.target.value) } }} />
                        </label>
                        <label className="w-full flex gap-2">
                            Nhãn
                            <input className="relative flex-1 w-32 border-b-2 border-slate-600 focus:border-slate-800 outline-none" value={tagName} onChange={e => { if (e.target.value.length < 12) { setTagName(e.target.value) } }} />
                        </label>
                    </div>
                    <label className="flex flex-col gap-2">
                        mô tả
                        <textarea className="w-full border-[1px] border-slate-600 rounded-sm p-1 h-fit" />
                    </label>
                    <div className="flex flex-col">
                        <div className="flex flex-col">
                            <p>Chọn ảnh chính cho kênh</p>
                            <div {...getRootProps()} className='h-12 border-[1px] border-cyan-900 border-dashed flex items-center text-center justify-center'>
                                <input {...getInputProps()} className='w-full h-full' />
                                {
                                    isDragActive ?
                                        <p className="text-red-500">Thả ảnh tại đây.</p> :
                                        <div className="flex gap-1"><p className="max-lg:hidden">Kéo thả hoặc</p>bấm để chọn file ảnh</div>
                                }
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <p>Chọn ảnh nền cho kênh</p>
                            <div {...getThumbnailRootProps()} className='h-12 border-[1px] border-cyan-900 border-dashed flex items-center text-center justify-center'>
                                <input {...getThumbnailInputProps()} className='w-full h-full' />
                                {
                                    isThumbnailDragActive ?
                                        <p className="text-red-500">Thả ảnh tại đây.</p> :
                                        <div className="flex gap-1"><p className="max-lg:hidden">Kéo thả hoặc</p>bấm để chọn file ảnh</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="items-top flex space-x-2">
                        <input type="checkbox" id="terms1" checked={accept} onChange={e => setAccept(e.target.checked)} />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Accept terms and conditions
                            </label>
                            <p className="text-sm text-muted-foreground font-bold">
                                You agree to our <Link className="underline text-red-500" href={'/Term'}>Terms of Service and Privacy Policy.</Link>
                            </p>
                        </div>
                    </div>
                    <div>
                        <button className={`${accept ? 'bg-gradient-to-r from bg-cyan-200 to-cyan-600 text-black' : 'bg-red-500 text-yellow-50 border-[1px] '} font-bold text-xl w-full h-10`} disabled={!accept}>{accept ? 'Tạo kênh' : 'Đồng ý với điều khoản trước!'}</button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-grow px-[5%]">
                <p className="text-3xl font-semibold">Xem trước giao diện kênh</p>
                <div className="flex flex-col border-[1px] rounded-lg">
                    <div className="w-full h-auto max-h-60">
                        <div className="relative w-full min-h-[140px] h-40">
                            <Image src={originalThumbnail ? URL.createObjectURL(originalThumbnail) : ''} sizes="16/9" alt="" fill />
                        </div>
                    </div>
                    <div className="flex gap-8 mt-2">
                        <div className="flex items-center lg:pl-[20%]">
                            <div className="w-[70px] h-[70px] relative">
                                <Image src={originalAvatar ? URL.createObjectURL(originalAvatar) : ''} alt="" className="rounded-full" sizes="1/1" fill />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-2xl font-bold">{name}</p>
                            <p>@{tagName}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}