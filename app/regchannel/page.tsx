'use client'
import Image from "next/image"
import { useState } from "react"

import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';

import { uploadBytes, ref } from 'firebase/storage'
import { storage } from '@/lib/firebase'

const { Dragger } = Upload;




export default function Page() {

    const [name, setName] = useState<string>('')
    const [tagName, setTagName] = useState<string>('')


    const [avatar, setAvatar] = useState<any>();
    const [thumbnail, setThumbnail] = useState<any>();
  
    const [originalAvatar, setOriginalAvatar] = useState<File>();
    const [originalThumbnail, setOriginalThumbnail] = useState<File>();

    const handleFinish = () => {
        const avatarStorageRef = ref(storage, `/channel/avatars/${tagName}`)
        const bannerStorageRef = ref(storage, `/channel/banners/${tagName}`)
        // uploadBytes(avatarStorageRef, originalAvatar)
        // uploadBytes(bannerStorageRef, originalThumbnail)
    }

    return (
        <div className="flex flex-col lg:flex-row px-12 pt-12 mt-16">
            <div className="w-full lg:w-1/3 px-3">
                <div className="flex flex-col gap-3">
                    <p className="text-3xl font-semibold">Điền thông tin</p>
                    <div className="grid xl:grid-cols-2 gap-3 lg:grid-cols-1 grid-cols-2">
                        <label className="w-full flex gap-2">
                            tên kênh
                            <input className="relative flex-1 w-32 border-b-2 border-slate-600 focus:border-slate-800 outline-none" value={name} onChange={e => setName(e.target.value)} />
                        </label>
                        <label className="w-full flex gap-2">
                            nhãn
                            <input className="relative flex-1 w-32 border-b-2 border-slate-600 focus:border-slate-800 outline-none" value={tagName} onChange={e => setTagName(e.target.value)} />
                        </label>
                    </div>
                    <label className="flex flex-col gap-2">
                        mô tả
                        <textarea className="w-full border-2 p-1 h-fit" />
                    </label>
                    <div>

                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-grow px-[5%]">
                <p className="text-3xl font-semibold">Xem trước giao diện kênh</p>
                <div className="flex flex-col border-[1px] rounded-lg">
                    <div className="w-full h-auto max-h-60">
                        {/* <Image src={avatar} sizes="16/9" alt="" className="w-full min-h-[140px] max-h-full" /> */}
                    </div>
                    <div className="flex gap-8">
                        <div className="flex items-center lg:pl-[20%]">
                            <Image src={avatar} alt="" className="rounded-full" width={70} height={70} />
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