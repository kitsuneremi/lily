'use client'
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase'
import Link from 'next/link'
import Image from 'next/image'
import { FormatDateTime, ReduceString } from '@/lib/functional'
import { useEffect, useState } from "react";
import { VideoDataType, ChannelDataType } from "@/type/type";
// const fetchImg = async ({ videoLink, channelTagname }: { videoLink: string, channelTagname: string }) => {
//     'use server'
//     const videoImageStorageRef = ref(storage, `/video/thumbnails/${videoLink}`)
//     const channelAvatarStorageRef = ref(storage, `/channel/avatars/${channelTagname}`)
//     const img = await getDownloadURL(videoImageStorageRef)
//     const channelAvatar = await getDownloadURL(channelAvatarStorageRef)

//     return { img, channelAvatar }
// }


export default ({ videoData, channelData }: { videoData: VideoDataType, channelData: ChannelDataType }) => {


    const [img, setImg] = useState<string>('')
    const [channelAvatar, setChannelAvatar] = useState<string>('')
    const videoImageStorageRef = ref(storage, `/video/thumbnails/${videoData.link}`)
    const channelAvatarStorageRef = ref(storage, `/channel/avatars/${channelData.tagName}`)
    useEffect(() => {


        getDownloadURL(videoImageStorageRef).then(url => setImg(url))
        getDownloadURL(channelAvatarStorageRef).then(url => setChannelAvatar(url))
    }, [])

    // const {img, channelAvatar} = Promise.all([fetchImg])

    return (
        <Link href={`/watch/${videoData.link}`}>
            <div className='w-full grid items-center max-[640px]:w-[80vw] max-[640px]:mx-auto h-fit' style={{ gridTemplateRows: "subgrid", gridRow: 2 }}>
                <div className="relative w-full h-fit min-h-[120px] pt-[56.25%]">
                    <Image alt='' className="" fill src={img} loading="lazy"/>
                </div>
                <div className="flex w-full gap-3 pt-1">
                    <div className="w-[30px]">
                        <Link href={`/channel/${channelData.tagName}`}><Image alt="img" width={30} height={30} loading="lazy" src={channelAvatar} /></Link>
                    </div>
                    <div className="w-[calc(100%-30px)] grid grid-rows-3">
                        <p className="text-xl font-bold w-full max-h-14 text-ellipsis overflow-hidden">{videoData.title}</p>
                        <div>
                            <Link href={`/channel/${channelData.tagName}`}>
                                <p className="text-lg font-semibold">
                                    {channelData.name}
                                </p>
                            </Link>
                        </div>
                        <div>
                            <p className="text-sm">{videoData.view} lượt xem</p>
                            <p className="text-sm">{FormatDateTime(videoData.createdAt)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )

}