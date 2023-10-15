'use client'
import Image from 'next/image'
import Navbar from '@/components/own/navbar'
import Sidebar from '@/components/own/watchsidebar';
import React, { useEffect, useRef, useState, useLayoutEffect } from "react";

import axios from 'axios';
import { VideoDataType, CommentDataType, BigVideoDataType } from '@/type/type';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BiMenuAltLeft } from 'react-icons/bi'
import { GrNotification } from 'react-icons/gr'
import { AiOutlineDown, AiFillLike, AiOutlineLike, AiFillDislike, AiOutlineDislike, AiOutlineShareAlt } from 'react-icons/ai'
import { FormatDateTime } from '@/lib/functional'
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';
import CommentItem from '@/components/own/watch/comment/CommentItem'
import dynamic from 'next/dynamic';
import { handleSubmit } from '@/components/own/watch/comment/CommentInput'
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase'

import VideoPlayer from '@/components/own/watch/VideoPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Page({ videoData }: { videoData: BigVideoDataType }) {
    const [channelAvatar, setChannelAvatar] = useState<string>()

    useEffect(() => {

    }, [])



    const { data: session } = useSession()
    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);

    useEffect(() => {
        if (session && session.user) {
            console.log(session)
            axios.get('/api/like/find', {
                params: {
                    // @ts-ignore
                    accountId: session.user.id,
                    targetId: videoData.channelData.id
                },
                headers: {
                    //@ts-ignore
                    Authorization: `Bearer ${session.user.accessToken}`
                }
            }).then(val => {
                if (val.data.type == null) {
                    setLike(false)
                    setDislike(false)
                } else {
                    if (val.data.type == 0) {
                        setLike(true)
                        setDislike(false)
                    } else {
                        setLike(false)
                        setDislike(true)
                    }
                }
            })
        }
    }, [session])

    useEffect(() => {
        const channelAvatarStorageRef = ref(storage, `/channel/avatars/${videoData.channelData.tagName}`)
        getDownloadURL(channelAvatarStorageRef).then(url => setChannelAvatar(url))
    }, [])

    const handleLike = () => {
        if (session && session.user) {
            if (like) {
                setLike(false);
                setDislike(false);
                axios.post('/api/like/delete', {
                    // @ts-ignore
                    accountId: session.user.id,
                    targetId: videoData.channelData.id,
                })
            } else {
                setLike(true);
                setDislike(false);
                axios.post('/api/like/add', {
                    // @ts-ignore
                    accountId: session.user.id,
                    targetId: videoData.channelData.id,
                    type: 0
                })
            }
        }
    };
    const handleDislike = () => {

        if (session && session.user) {
            setDislike(!dislike);
            setLike(false);
            if (dislike) {
                axios.post('/api/like/delete', {
                    // @ts-ignore
                    accountId: session.user.id,
                    targetId: videoData.channelData.id,
                })
            } else {
                axios.post('/api/like/add', {
                    // @ts-ignore
                    accountId: session.user.id,
                    targetId: videoData.channelData.id,
                    type: 1
                })
            }
        }
    };

    const CommentRender = () => {
        return (
            <>
                {videoData.commentData.length > 0 ? videoData.commentData.map((cmt, index) => {
                    return <CommentItem cmt={cmt} />
                }) : <div className='flex justify-center'>
                    <p>video này chưa có bình luận nào</p>
                </div>}
            </>
        )
    }


    const VideoSuggest = () => {

        return (
            <div className='flex'>
                <div className='w-[40%] h-[240px]'>

                </div>
                <div className='flex flex-col'>
                    <p>abc</p>
                    <p>def</p>
                </div>
            </div>
        )
    }

    return (
        <div className='w-full flex flex-col h-full'>
            <Navbar />
            <div className='relative mt-16 gap-10 h-full'>
                <Sidebar />
                <div className='lg:flex'>
                    <div className='flex flex-col w-full lg:w-3/4 lg:px-10 px-2 max-sm:px-0'>

                        <VideoPlayer videoData={videoData} />

                        {/* video property */}
                        <div className='max-sm:px-2'>
                            <p className='text-2xl font-bold'>{videoData.videoData.title}</p>
                            <div className='flex justify-between max-sm:flex-col'>
                                <div className='flex gap-2 max-sm:flex-col'>
                                    <div className='flex gap-3'>
                                        <div className='flex flex-col justify-center'>
                                            <div className='relative lg:w-[55px] lg:h-[55px] max-sm:w-[45px] max-sm:h-[45px] w-[40px] h-[40px]'>
                                                {channelAvatar && <Image src={channelAvatar} alt='' className='rounded-xl' fill />}
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <p className='text-xl font-semibold'>{videoData.channelData.name}</p>
                                            <p>{videoData.channelData.sub} Người đăng ký</p>
                                        </div>
                                    </div>

                                    <div className='flex px-3 py-2 max-sm:w-full'>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className='outline-none max-sm:w-full'>
                                                <div className='flex gap-2 px-4 py-2 rounded-[24px] border-[1px] hover:bg-slate-300'>
                                                    <div className='flex flex-col justify-center'>
                                                        <GrNotification />
                                                    </div>
                                                    <p className='my-auto max-sm:w-full'>Đã đăng ký</p>
                                                    <div className='flex flex-col justify-center'>
                                                        <AiOutlineDown />
                                                    </div>
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Nhận thông báo</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Tất cả</DropdownMenuItem>
                                                <DropdownMenuItem>Hạn chế</DropdownMenuItem>
                                                <DropdownMenuItem>Không</DropdownMenuItem>
                                                <DropdownMenuItem>Hủy đăng ký</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <div className='flex justify-around items-center gap-3'>
                                    <div className='flex my-auto border-slate-300 border-[1px] rounded-[24px]'>
                                        <div className='flex gap-1 hover:bg-slate-300 py-2 px-3 rounded-s-3xl cursor-pointer'>
                                            <div className='flex flex-col justify-center' onClick={handleLike}>
                                                {like ? <AiFillLike /> : <AiOutlineLike />}
                                            </div>
                                            <p>{videoData.videoData.like}</p>
                                        </div>
                                        <div className='relative after:absolute after:bg-slate-300 after:h-[80%] after:top-[10%] after:w-[1px]'></div>
                                        <div className='flex flex-col justify-center hover:bg-slate-300 py-2 px-3 rounded-e-3xl cursor-pointer' onClick={handleDislike}>
                                            {dislike ? <AiFillDislike /> : <AiOutlineDislike />}
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-center h-fit p-3 rounded-full border-[1px] border-slate-300'>
                                        <AiOutlineShareAlt />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* des */}
                        <div className='rounded-xl p-3 m-2 flex flex-col gap-2 bg-slate-200'>
                            <div className='flex gap-3'>
                                <p>{videoData.videoData.view} lượt xem</p>
                                <p>{FormatDateTime(videoData.videoData.createdAt)}</p>
                            </div>
                            <p className=''>{videoData.videoData.des}</p>
                        </div>
                        {/* comment */}
                        <div className='flex flex-col gap-2'>
                            <div className='flex gap-1 px-3'>
                                <p className='my-auto h-fit'>{videoData.commentData.length} bình luận</p>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className='outline-none'>
                                        <div className='flex items-center gap-2 px-3 py-2 rounded-[24px] hover:bg-slate-300'>
                                            <BiMenuAltLeft />
                                            Sắp xếp theo
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>Bình luận hàng đầu</DropdownMenuItem>
                                        <DropdownMenuItem>Thời gian </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className='flex'>
                                {/* <Image alt='' className='my-auto' src={src} width={45} height={45} /> */}
                                <div className='w-[45px] h-[45px] my-auto'></div>
                                <form action={handleSubmit} className='flex-grow'>
                                    <input type='text' name="cmt" className='w-full outline-none border-b-[1px] border-slate-400 focus:border-slate-500 flex-grow' />
                                    <input type='hidden' name='videoId' value={videoData.videoData.id} />
                                    {/* @ts-ignore */}
                                    <input type='hidden' name='accountId' value={session?.user.id} />
                                    <input type='hidden' name='videoLink' value={videoData.videoData.link} />
                                </form>
                            </div>
                            <Tabs defaultValue="comment" className="w-full lg:hidden">
                                <TabsList className='w-full grid grid-cols-2'>
                                    <TabsTrigger value="comment">Comment</TabsTrigger>
                                    <TabsTrigger value="video">Video</TabsTrigger>
                                </TabsList>
                                <TabsContent value="comment">
                                    {CommentRender()}
                                </TabsContent>
                                <TabsContent value="video">
                                    <div className='h-80'>
                                        {VideoSuggest()}
                                    </div>
                                </TabsContent>
                            </Tabs>
                            <div className='flex-col gap-2 mt-4 hidden lg:flex'>
                                {CommentRender()}
                            </div>
                        </div>
                    </div>
                    <div className='hidden lg:flex flex-grow'>
                        <div className='h-[70vh] overflow-y-scroll w-full'>
                            {VideoSuggest()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}




// useEffect(() => {
//     const handleSpacebar = (e) => {
//         if (e.code === "Space" && e.target.tagName !== "INPUT") {
//             e.preventDefault();
//             e.target.value += " ";
//             const video = playerRef.current;
//             if (video.paused) {
//                 video.play();
//             } else {
//                 video.pause();
//             }
//         }
//     };

//     document.addEventListener("keydown", handleSpacebar);

//     return () => {
//         document.removeEventListener("keydown", handleSpacebar);
//     };
// }, []);

// useEffect(() => {
//     const videoElement = playerRef.current;

//     const handleTimeUpdate = () => {
//         const { currentTime, duration } = videoElement;
//         const seventyFivePercent = duration * 0.75;
//         if (currentTime >= seventyFivePercent && (triggerView == false)) {
//             setTriggerView(true)
//             axios.post('/api/video/increaseview', {
//                 link: link
//             })
//         }
//     }
//     videoElement.addEventListener('timeupdate', handleTimeUpdate);

//     return () => {
//         videoElement.removeEventListener('timeupdate', handleTimeUpdate);
//     };
// }, [videoDuration, triggerView])





// useEffect(() => {
//     axios.get(`/api/video/findbylink`, {
//         params: {
//             link: link
//         }
//     }).then(res => { setVideoData(res.data); })
// }, [link])