'use client'
import Image from 'next/image'
import Navbar from '@/components/own/navbar'
import Sidebar from '@/components/own/watchsidebar';
import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import axios from 'axios';
import { BigVideoDataType } from '@/type/type';
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
import { useSession } from 'next-auth/react';
import CommentItem from '@/components/own/watch/comment/CommentItem'
import { handleSubmit } from '@/components/own/watch/comment/CommentInput'
import { ref as fireRef, getDownloadURL } from "firebase/storage";
import { storage } from '@/lib/firebase'
import Hls from "hls.js";
import { ImVolumeHigh, ImVolumeMedium, ImVolumeLow, ImVolumeMute, ImVolumeMute2 } from 'react-icons/im'
import { BsFillPlayFill, BsFillPauseFill, BsArrowsFullscreen, BsFullscreenExit } from 'react-icons/bs'
import { MdSkipNext } from 'react-icons/md'
import { AiFillSetting } from 'react-icons/ai'
import { Slider } from 'antd';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CiPlay1, CiPause1 } from 'react-icons/ci'
import { RxTrackNext } from 'react-icons/rx'
import { NotificationOutlined } from '@ant-design/icons'
import Link from 'next/link'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


type quality = {
    available: number[],
    current: number
}

const formatter = (value: number) => `${value}%`;
let timer: any;

export default function Page({ videoData }: { videoData: BigVideoDataType }) {
    const [channelAvatar, setChannelAvatar] = useState<string>();
    const [src, setSrc] = useState<string>(`https://file.erinasaiyukii.com/api/video/${videoData.videoData.link}`);
    const [volume, setVolume] = useState<number>(100);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [loadedProgress, setLoadedProgress] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(1);
    const [quality, setQuality] = useState<quality>({ current: 0, available: [] });
    const [fullscreen, setFullscreen] = useState<boolean>(false);
    const [loadedContent, setLoadedContent] = useState<boolean>(false);
    const [currentAccountAvatar, setCurrentAccountAvatar] = useState<string>();

    const { data: session } = useSession()
    const [like, setLike] = useState<boolean>(false);
    const [dislike, setDislike] = useState<boolean>(false);
    const [hide, setHide] = useState<boolean>(false)

    const ref = useRef<HTMLVideoElement>(null);
    const fullRef = useRef<HTMLDivElement>(null);
    const anyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadVideo = async () => {
            const video = document.getElementById("video") as HTMLVideoElement;
            var hls = new Hls();
            hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                console.log('video and hls.js are now bound together !');
            });
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                setQuality(prev => { return { current: prev.current, available: data.levels.map(e => e.height) } })
                hls.loadLevel = quality.current;
                setLoadedContent(true);
            });

            hls.on(Hls.Events.FRAG_LOADED, function (event, data) {
                // @ts-ignore
                const totalChunks = hls.media.duration;
                // @ts-ignore
                const loadedChunks = hls.buffered.end(0);
                const progress = (loadedChunks / totalChunks) * 100;
                setLoadedProgress(progress);
            });

            hls.loadSource(src);
            hls.attachMedia(video);
        }
        loadVideo();
    }, [src, quality.current]);

    useEffect(() => {
        if (session && session.user) {
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
        const video = ref.current;
        if (video) {
            video.playbackRate = speed;
        }
    }, [speed])

    useEffect(() => {
        const video = ref.current;
        if (video) {
            video.volume = volume / 100;
        }
    }, [volume])

    useEffect(() => {
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                handlePlayPause();
            }
            if (e.code === 'Escape') {
                e.preventDefault();
                setFullscreen(false);
            }
        })

        return (
            window.removeEventListener('keydown', (e: any) => {
                if (e.code === 'Space') {
                    e.preventDefault();
                    handlePlayPause();
                }
            })
        )
    }, [''])

    useEffect(() => {
        const channelAvatarStorageRef = fireRef(storage, `/channel/avatars/${videoData.channelData.tagName}`)
        getDownloadURL(channelAvatarStorageRef).then(url => setChannelAvatar(url))
        if (session) {
            try {
                //@ts-ignore
                const currentAccountStorageRef = fireRef(storage, `/accounts/${session?.user.id}`)
                getDownloadURL(currentAccountStorageRef).then(url => setCurrentAccountAvatar(url))
            } catch (error) {

            }
        }
    }, [''])

    useEffect(() => {
        if (fullRef.current && document) {
            if (fullscreen) {
                if (window.innerHeight > window.innerWidth) {
                    fullRef.current.requestFullscreen();
                    //@ts-ignore
                    screen.orientation.lock('landscape');
                } else {
                    fullRef.current.requestFullscreen();
                }

            } else {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            }
        }
    }, [fullscreen])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            clearTimeout(timer);
            setHide(false)
            timer = setTimeout(() => {
                setHide(true)
            }, 2000)

        }

        const handleMouseLeave = () => {
            clearTimeout(timer)
            setHide(true)
        };

        anyRef.current?.addEventListener('mousemove', handleMouseMove);
        anyRef.current?.addEventListener('mouseout', handleMouseLeave);

        return () => {
            anyRef.current?.removeEventListener('mousemove', handleMouseMove);
            anyRef.current?.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [''])

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

    const VolumeIcon = () => {
        if (volume == 0) {
            return <ImVolumeMute2 />
        } else if (volume > 75) {
            return <ImVolumeHigh />
        } else if (volume > 50) {
            return <ImVolumeMedium />
        } else if (volume > 25) {
            return <ImVolumeLow />
        } else {
            return <ImVolumeMute />
        }
    }

    const onTimeUpdate = (e: any) => {
        const video = e.target;
        setCurrentTime(video.currentTime);
    }

    const onProgress = (e: any) => {
        const video = e.target;
        if (video.buffered.length > 0) {
            const loadedChunks = video.buffered.end(0);
            const totalChunks = video.duration;
            const progress = (loadedChunks / totalChunks) * 100;
            setLoadedProgress(progress);
        }
    }

    const onTimelineClick = (e: any) => {
        const timeline = document.getElementById("timeline");
        const video = ref.current;
        if (timeline && video) {
            const rect = timeline.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const timelineWidth = rect.width;
            const newPosition = (offsetX / timelineWidth) * video.duration;
            video.currentTime = newPosition;
        }
    }


    const handlePlayPause = () => {
        const video = ref.current;
        if (video) {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    }

    const handleFullscreen = () => {
        setFullscreen(prev => !prev);

    }

    const items: MenuProps['items'] = [
        {
            key: '1',
            type: 'group',
            label: 'Chất lượng',
            children: quality.available.map((q, index) => {
                return (
                    {
                        key: `1-${index}`,
                        label: q,
                        onClick: () => { setQuality(prev => { return { current: index, available: prev.available } }) },
                    }
                )
            })
        },
        {
            key: '2',
            label: 'Tốc độ phát',
            children: [
                {
                    key: '2-1',
                    label: '0.5x',
                    onClick: () => { setSpeed(0.5) },
                },
                {
                    key: '2-2',
                    label: '1x',
                    onClick: () => { setSpeed(1) },
                },
                {
                    key: '2-3',
                    label: '1.5x',
                    onClick: () => { setSpeed(1.5) },
                },
                {
                    key: '2-4',
                    label: '2x',
                    onClick: () => { setSpeed(2) },
                },
            ],
        }
    ];

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
        <div className='w-full flex flex-col h-screen pt-16'>
            {!fullscreen && <Navbar />}
            <div className={`relative ${fullscreen ? 'mt-0' : 'mt-3'} gap-10 h-full`}>
                {!fullscreen && <Sidebar />}
                <div className='lg:flex'>
                    <div ref={fullRef} className={`flex group flex-col w-full max-sm:px-2 px-5 ${fullscreen ? 'absolute w-screen top-0 left-0 bg-white dark:bg-slate-600 overflow-y-scroll px-0 py-0 hidden-scrollbar' : `relative lg:w-3/4 lg:px-10 px-2`}`}>
                        <div ref={anyRef} className={`flex justify-center relative ${loadedContent ? '' : 'pt-[56.25%] max-h-[80vh]'} ${fullscreen ? 'w-full h-screen px-3' : ''} rounded-xl`}>
                            <video
                                ref={ref}
                                id="video"
                                autoPlay
                                onTimeUpdate={onTimeUpdate}
                                onProgress={onProgress}
                                onClick={handlePlayPause}
                                className={`${fullscreen ? 'h-screen' : 'max-h-[80vh]'} w-full`}
                            />
                            <div className={`flex flex-col gap-2 z-20 absolute bottom-0 w-full ${hide ? 'opacity-0' : 'opacity-100 translate-y-0 transition-opacity duration-300 ease-in-out'} h-fit px-2 transform translate-y-[1px]`}>
                                {/* timeline */}
                                <div className="flex items-center relative">
                                    <div className="w-full h-2 bg-slate-100 absolute top-0 rounded-lg" id="timeline" onClick={onTimelineClick}>
                                        <div
                                            style={{ width: `${loadedProgress}%` }}
                                            className="h-full bg-cyan-200 rounded-lg"

                                        ></div>
                                        <div
                                            //@ts-ignore
                                            style={{ width: `${(currentTime / ref.current?.duration) * 100}%` }}
                                            className="h-full bg-red-500 absolute top-0 rounded-lg"
                                        ></div>
                                    </div>
                                </div>

                                {/* control */}
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <div className="flex items-center">
                                            <div className="text-2xl cursor-pointer" onClick={handlePlayPause}>
                                                {ref.current?.paused ? <BsFillPlayFill /> : <BsFillPauseFill />}
                                            </div>
                                            <div className="text-2xl cursor-pointer">
                                                <MdSkipNext />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="text-lg cursor-pointer">
                                                {VolumeIcon()}
                                            </div>

                                            {/* @kitsuneremi khẹc */}
                                            {/* @ts-ignore */}
                                            <Slider tooltip={{ formatter }} value={volume} onChange={e => setVolume(e)} className="w-24" />
                                        </div>
                                        <div className='flex items-center max-sm:hidden'>
                                            {ref.current && <p className='text-slate-200'>{ref.current?.currentTime.toFixed(0)} / {isNaN(ref.current?.duration) ? 0 : ref.current?.duration.toFixed(0)}</p>}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Dropdown menu={{ items }} placement='topRight'>
                                            <a onClick={(e) => e.preventDefault()}>
                                                <div className="text-xl cursor-pointer flex items-center">
                                                    <AiFillSetting />
                                                </div>
                                            </a>
                                        </Dropdown>
                                        <div className="text-md cursor-pointer flex items-center" onClick={handleFullscreen}>
                                            {fullscreen ? <BsFullscreenExit /> : <BsArrowsFullscreen />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`${hide ? '' : 'bg-controls'} absolute bottom-0 w-full h-[20%] z-10`} />
                        </div>

                        {/* video property */}
                        <div className={`max-sm:px-2 mt-2 ${fullscreen ? 'px-3' : ''}`}>
                            <p className='text-3xl font-bold my-3'>{videoData.videoData.title}</p>
                            <div className='flex justify-between max-sm:flex-col'>
                                <div className='flex gap-2 max-sm:flex-col'>
                                    <div className='flex gap-3'>
                                        <div className='flex flex-col justify-center'>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Link href={`/channel/${videoData.channelData.tagName}`}>
                                                            <div className='relative lg:w-[55px] lg:h-[55px] max-sm:w-[45px] max-sm:h-[45px] w-[40px] h-[40px]'>
                                                                {channelAvatar && <Image src={channelAvatar} alt='' className='rounded-full bg-transparent' sizes='1/1' fill />}
                                                            </div>
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>chuyển hướng tới kênh {videoData.channelData.name}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Link href={`/channel/${videoData.channelData.tagName}`}><p className='text-xl font-semibold'>{videoData.channelData.name}</p></Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>chuyển hướng tới kênh {videoData.channelData.name}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <p>{videoData.channelData.sub} Người đăng ký</p>
                                        </div>
                                    </div>

                                    <div className='flex px-3 py-2 max-sm:w-full'>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className='outline-none max-sm:w-full'>
                                                <div className='flex gap-2 px-4 py-2 rounded-[24px] border-[1px] hover:bg-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800'>
                                                    <div className='flex flex-col justify-center animate-bounce dark:text-white'>
                                                        <NotificationOutlined />
                                                    </div>
                                                    <p className='my-auto max-sm:w-full'>Đã đăng ký</p>
                                                    <div className='flex flex-col justify-center'>
                                                        <AiOutlineDown />
                                                    </div>
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <div className='p-2 rounded-lg'>
                                                    <DropdownMenuLabel>Nhận thông báo</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>Tất cả</DropdownMenuItem>
                                                    <DropdownMenuItem>Hạn chế</DropdownMenuItem>
                                                    <DropdownMenuItem>Không</DropdownMenuItem>
                                                    <DropdownMenuItem>Hủy đăng ký</DropdownMenuItem>
                                                </div>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <div className='flex justify-around items-center gap-3'>
                                    <div className='flex my-auto shadow-[0_0_5px_#0f0f0f] rounded-[24px] border-[1px]'>
                                        <div className='flex gap-1 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 py-2 px-3 rounded-s-3xl cursor-pointer'>
                                            <div className='flex flex-col justify-center' onClick={handleLike}>
                                                {like ? <AiFillLike /> : <AiOutlineLike />}
                                            </div>
                                            <p>{videoData.videoData.like}</p>
                                        </div>
                                        <div className='relative after:absolute after:bg-slate-300 after:h-[80%] after:top-[10%] after:w-[1px]'></div>
                                        <div className='flex flex-col justify-center dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 py-2 px-3 rounded-e-3xl cursor-pointer' onClick={handleDislike}>
                                            {dislike ? <AiFillDislike /> : <AiOutlineDislike />}
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-center h-fit p-3 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 border-[1px] rounded-full shadow-[0_0_5px_#0f0f0f]'>
                                        <AiOutlineShareAlt />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* des */}
                        <div className='rounded-xl p-3 my-4 flex flex-col gap-2 bg-slate-200 dark:bg-slate-900'>
                            <div className='flex gap-3'>
                                <p>{videoData.videoData.view} lượt xem</p>
                                <p>{FormatDateTime(videoData.videoData.createdAt)}</p>
                            </div>
                            <p className=''>{videoData.videoData.des}</p>
                        </div>
                        {/* comment */}
                        <div className='flex flex-col gap-2'>
                            <div className='flex gap-3 px-3'>
                                <p className='my-auto h-fit'>{videoData.commentData.length} bình luận</p>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className='outline-none'>
                                        <div className='flex items-center gap-2 px-3 py-2 rounded-[24px] hover:bg-slate-300 dark:hover:bg-slate-800'>
                                            <BiMenuAltLeft />
                                            Sắp xếp theo
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <div className='p-1 rounded-lg'>
                                            <DropdownMenuItem>Bình luận hàng đầu</DropdownMenuItem>
                                            <DropdownMenuItem>Thời gian </DropdownMenuItem>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className='flex gap-3'>
                                <div className='h-9 w-9 relative'>
                                    {currentAccountAvatar ?
                                        <Image alt='' className='my-auto bg-transparent rounded-full' src={currentAccountAvatar} sizes='1/1' fill />
                                        :
                                        <Image alt='' className='my-auto rounded-full bg-transparent animate-spin' src={'https://danviet.mediacdn.vn/upload/2-2019/images/2019-04-02/Vi-sao-Kha-Banh-tro-thanh-hien-tuong-dinh-dam-tren-mang-xa-hoi-khabanh-1554192528-width660height597.jpg'} fill sizes='1/1' />}
                                </div>
                                <form action={handleSubmit} className='flex-grow'>
                                    <input type='text' name="cmt" className='w-full outline-none border-b-[1px] bg-transparent border-slate-400 focus:border-slate-500 flex-grow' />
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
                        <div className='h-[70vh] overflow-y-scroll w-full hidden-scrollbar'>
                            {VideoSuggest()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}