'use client'
import { VideoDataType, CommentDataType } from '@/type/type';
import { FormatDateTime, baseURL } from '@/lib/functional'
import { useSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import { useEffect, useState } from 'react';
import { AiOutlineDown, AiFillLike, AiOutlineLike, AiFillDislike, AiOutlineDislike } from 'react-icons/ai'
import axios from 'axios';
import Image from 'next/image';

type AccountDataType = {
    id: number,
    email: string,
    name: string,
    username: string,
    isAdmin: boolean,
    createdAt: Date,
    updatedAt: Date
}

export default function CommentItem({ cmt }: { cmt: CommentDataType }){
    const [like, setLike] = useState<boolean>(false);
    const [dislike, setDislike] = useState<boolean>(false);
    const [imgSrc, setSrc] = useState<string>('')
    // useEffect(() => {
    //     const channelAvatarStorageRef = ref(storage, `/channel/avatars/${videoData.channelData.tagName}`)
    //     getDownloadURL(channelAvatarStorageRef).then(url => setChannelAvatar(url))
    // },[])
    const [accountData, setAccountData] = useState<AccountDataType>()
    useEffect(() => {
        axios.get('/api/account/data', {
            params: {
                id: cmt.accountId
            }
        }).then(res => {
            setAccountData(res.data)
        })
    }, [])
    return (
        <div className='flex'>
            <div className='w-[45px] h-full'></div>
            {/* <Image src={} width={45} height={45}/> */}

            <div className='flex flex-col gap-1'>
                <div className='flex gap-3'>
                    <p>@{accountData?.name}</p>
                    <p>{FormatDateTime(cmt.createdAt)}</p>
                </div>

                <div>
                    <p>{cmt.content}</p>
                </div>
                <div className='flex gap-1'>
                    {like ? <AiFillLike /> : <AiOutlineLike />}
                    {dislike ? <AiFillDislike /> : <AiOutlineDislike />}
                    <p>Phản hồi</p>
                </div>

            </div>
        </div>
    )
}