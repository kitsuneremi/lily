'use client'
import React, { useRef, useEffect, useState } from "react";
import Hls from "hls.js";
import { ImVolumeHigh, ImVolumeMedium, ImVolumeLow, ImVolumeMute } from 'react-icons/im'
import { BsFillPlayFill, BsFillPauseFill, BsArrowsFullscreen, BsFullscreenExit } from 'react-icons/bs'
import { MdSkipNext } from 'react-icons/md'
import { AiFillSetting } from 'react-icons/ai'
import { Slider } from 'antd';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { BigVideoDataType } from "@/type/type";

type quality = {
    available: number[],
    current: number
}

const formatter = (value: number) => `${value}%`;


const Player = ({ videoData }: { videoData: BigVideoDataType }) => {
    const [quality, setQuality] = useState<quality>({ current: 1080, available: [] });
    const [src, setSrc] = useState<any>(`https://file.erinasaiyukii.com/api/video/${videoData.videoData.link}`);
    const [volume, setVolume] = useState<number>(100);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [loadedProgress, setLoadedProgress] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(1);

    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const loadVideo = async () => {
            const video = document.getElementById("video") as HTMLVideoElement;
            var hls = new Hls();
            hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                console.log('video and hls.js are now bound together !');
            });
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                setQuality({ current: data.levels[0].height, available: data.levels.map(e => e.height) })
                console.log(
                    'manifest loaded, found ' + data.levels.length + ' quality level',
                );
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
    }, [src]);

    useEffect(() => {
        console.log(quality)
    }, [quality])

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
        const t = (e: any) => {
            if (e.code === 'Space') {
                e.preventDefault();
                handlePlayPause();
            }
        }

        window.addEventListener('keydown', t)

        return (
            window.removeEventListener('keydown', t)
        )
    }, [{}])

    const VolumeIcon = () => {
        if (volume > 75) {
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




    const items: MenuProps['items'] = [
        {
            key: '1',
            type: 'group',
            label: 'Chất lượng',
            children: [
                {
                    key: '1-1',
                    label: '1920x1080',
                },
                {
                    key: '1-2',
                    label: '1280x720',
                },
            ],
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

    return (
        <div className="relative">
            <video
                ref={ref}
                id="video"
                autoPlay
                onTimeUpdate={onTimeUpdate}
                onProgress={onProgress}
                onClick={handlePlayPause}
            />
            <div className="flex flex-col gap-2 absolute bottom-2 w-full h-8 px-2">
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
                        <div className="flex items-center">
                            <div className="text-lg cursor-pointer">
                                {VolumeIcon()}
                            </div>

                            {/* @kitsuneremi khẹc */}
                            {/* @ts-ignore */}
                            <Slider tooltip={{ formatter }} value={volume} onChange={e => setVolume(e)} className="w-24" />
                        </div>
                    </div>

                    <div className="flex gap-2 items-center">
                        <Dropdown menu={{ items }}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <div className="text-xl cursor-pointer">
                                        <AiFillSetting />
                                    </div>
                                </Space>
                            </a>
                        </Dropdown>
                        <div className="text-lg cursor-pointer">
                            {true ? <BsArrowsFullscreen /> : <BsFullscreenExit />}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )

}


export default Player