"use client";
import Image from "next/image";
import VideoItem from "@/components/own/watch/VideoItem";
import ThisChannelVideoItem from "@/components/own/watch/ThisChannelVideoItem";
import React, {
    useEffect,
    useRef,
    useState,
    FormEvent,
    useCallback,
} from "react";
import axios from "axios";
import { BigVideoDataType, CommentDataType, MediaDataType } from "@/types/type";
import { FormatDateTime, fileURL, videoTimeFormater } from "@/lib/functional";

import Hls, { HlsEventEmitter, ManifestParsedData } from "hls.js";
import {
    ImVolumeHigh,
    ImVolumeMedium,
    ImVolumeLow,
    ImVolumeMute,
    ImVolumeMute2,
} from "react-icons/im";
import {
    BsFillPlayFill,
    BsFillPauseFill,
    BsArrowsFullscreen,
    BsFullscreenExit,
} from "react-icons/bs";
import { MdSkipNext } from "react-icons/md";
import { AiFillSetting } from "react-icons/ai";
import { Slider } from "antd";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { useLocalStorage, useEffectOnce } from "usehooks-ts";
import { Skeleton } from "@/components/ui/skeleton";
import Properties from "@/components/own/watch/Properties";
import Description from "@/components/own/watch/Description";
import Expand from "@/components/own/watch/Expand";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

const VideoSuggestPrefetch = dynamic(() => import('@/components/own/watch/VideoSuggest/PrefetchData'))


type quality = {
    available: number[];
    current: number;
};

const formatter = (value: number) => `${value}%`;
let timer: any;

/**
 * 
 * @param mediaData: MediaDataType 
 */
const sourceURL = (mediaData: MediaDataType) => {
    if (mediaData.mediaType == 0) {
        return `${fileURL}/api/video/${mediaData.link}`;
    } else if (mediaData.mediaType == 1 && mediaData.isLive) {
        redirect(`/stream/${mediaData.link}`);
        return '';
    } else if (mediaData.mediaType == 1 && !mediaData.isLive) {
        return `${fileURL}/api/merge/${mediaData.link}/live`;
    } else {
        return ''
    }
}

export default function Page({ videoData }: { videoData: BigVideoDataType }) {
    const src = sourceURL(videoData.videoData);

    const ref = useRef<HTMLVideoElement>(null);
    const fullRef = useRef<HTMLDivElement>(null);
    const anyRef = useRef<HTMLDivElement>(null);

    const [volume, setVolume] = useLocalStorage("volume", 100);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [loadedProgress, setLoadedProgress] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(1);
    const [quality, setQuality] = useState<quality>({
        current: 0,
        available: [],
    });
    const [fullscreen, setFullscreen] = useState<boolean>(false);
    const [loadedContent, setLoadedContent] = useState<boolean>(false);
    const [hide, setHide] = useState<boolean>(false);

    const loadVideo = async () => {
        const video = document.getElementById("video") as HTMLVideoElement;
        var hls = new Hls({ startPosition: currentTime });
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            console.log("video and hls.js are now bound together !");
        });
        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
            setQuality((prev) => {
                return {
                    current: prev.current,
                    available: data.levels.map((e) => e.height),
                };
            });
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
    };

    useEffect(() => {
        loadVideo();
    }, [src, quality.current]);

    useEffect(() => {
        if (ref.current) {
            if (ref.current?.currentTime == ref.current?.duration) {
                axios.post("/api/video/updateview", {
                    videoId: videoData.videoData.id,
                });
            }
        }
    }, [ref.current?.currentTime]);

    useEffect(() => {
        if (ref.current) {
            ref.current.playbackRate = speed;
        }
    }, [speed]);

    useEffect(() => {
        if (ref.current) {
            ref.current.volume = volume / 100;
        }
    }, [volume]);

    useEffectOnce(() => {
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                handlePlayPause();
            }
            if (e.code === "Escape") {
                e.preventDefault();
                setFullscreen(false);
            }
        });

        return window.removeEventListener("keydown", (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                handlePlayPause();
            }
            if (e.code === "Escape") {
                e.preventDefault();
                setFullscreen(false);
            }
        });
    });

    // useEffect(() => {
    //     const channelAvatarStorageRef = fireRef(
    //         storage,
    //         `/channel/avatars/${videoData.channelData.tagName}`
    //     );
    //     getDownloadURL(channelAvatarStorageRef).then((url) =>
    //         setChannelAvatar(url)
    //     );
    //     if (session) {
    //         try {
    //             const currentAccountStorageRef = fireRef(
    //                 storage,
    //                 //@ts-ignore
    //                 `/accounts/${session?.user.id}`
    //             );
    //             getDownloadURL(currentAccountStorageRef).then((url) =>
    //                 setCurrentAccountAvatar(url)
    //             );
    //         } catch (error) {}
    //     }
    // }, [""]);

    useEffect(() => {
        if (fullRef.current && document) {
            if (fullscreen) {
                if (window.innerHeight > window.innerWidth) {
                    fullRef.current.requestFullscreen();
                    //@ts-ignore
                    screen.orientation.lock("landscape");
                } else {
                    fullRef.current.requestFullscreen();
                }
            } else {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            }
        }
    }, [fullscreen]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            clearTimeout(timer);
            setHide(false);
            timer = setTimeout(() => {
                setHide(true);
            }, 2000);
        };

        const handleMouseLeave = () => {
            clearTimeout(timer);
            setHide(true);
        };

        anyRef.current?.addEventListener("mousemove", handleMouseMove);
        anyRef.current?.addEventListener("mouseout", handleMouseLeave);

        return () => {
            anyRef.current?.removeEventListener("mousemove", handleMouseMove);
            anyRef.current?.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [0]);

    const onTimeUpdate = (e: any) => {
        setCurrentTime(e.target.currentTime);
    };

    const onProgress = (e: any) => {
        if (e.target.buffered.length > 0) {
            const loadedChunks = e.target.buffered.end(0);
            const totalChunks = e.target.duration;
            const progress = (loadedChunks / totalChunks) * 100;
            setLoadedProgress(progress);
        }
    };

    const onTimelineClick = (e: any) => {
        if (document.getElementById("timeline") && ref.current) {
            const rect = document.getElementById("timeline")!.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const timelineWidth = rect.width;
            const newPosition = (offsetX / timelineWidth) * ref.current.duration;
            ref.current.currentTime = newPosition;
        }
    };

    const handlePlayPause = () => {
        if (ref.current) {
            if (ref.current.paused) {
                ref.current.play();
            } else {
                ref.current.pause();
            }
        }
    };

    const items: MenuProps["items"] = [
        {
            key: "1",
            type: "group",
            label: "Chất lượng",
            children: quality.available.map((q, index) => {
                return {
                    key: `1-${index}`,
                    label: q,
                    onClick: () => {
                        setQuality((prev) => {
                            return {
                                current: index,
                                available: prev.available,
                            };
                        });
                    },
                };
            }),
        },
        {
            key: "2",
            label: "Tốc độ phát",
            children: [
                {
                    key: "2-1",
                    label: "0.5x",
                    onClick: () => {
                        setSpeed(0.5);
                    },
                },
                {
                    key: "2-2",
                    label: "1x",
                    onClick: () => {
                        setSpeed(1);
                    },
                },
                {
                    key: "2-3",
                    label: "1.5x",
                    onClick: () => {
                        setSpeed(1.5);
                    },
                },
                {
                    key: "2-4",
                    label: "2x",
                    onClick: () => {
                        setSpeed(2);
                    },
                },
            ],
        },
    ];

    return (
        <div
            className={`relative ${fullscreen ? "mt-0" : "mt-3"
                } h-full w-full overflow-y-scroll`}
        >
            <div className="flex max-lg:flex-col">
                <div
                    ref={fullRef}
                    className={`flex flex-col group w-full ${fullscreen
                        ? "absolute w-screen top-0 left-0 bg-white dark:bg-slate-600 overflow-y-scroll p-0 hidden-scrollbar"
                        : `relative lg:w-3/4 lg:px-10 max-sm:px-2 px-5`
                        }`}
                >
                    <div
                        ref={anyRef}
                        className={`flex justify-center relative aspect-video ${loadedContent ? "" : "max-h-[80vh]"
                            } ${fullscreen ? "w-full h-screen" : ""} rounded-xl`}
                    >
                        <video
                            ref={ref}
                            id="video"
                            autoPlay
                            onTimeUpdate={onTimeUpdate}
                            onProgress={onProgress}
                            onClick={handlePlayPause}
                            className={`${fullscreen ? "h-screen" : "max-h-[80vh]"
                                } w-full`}
                        />
                        <div
                            className={`flex flex-col gap-2 z-20 absolute bottom-0 w-full ${hide
                                ? "opacity-0"
                                : "opacity-100 translate-y-0 transition-opacity duration-300 ease-in-out"
                                } h-fit px-2 transform translate-y-[1px] ${fullscreen ? "px-3" : ""
                                }`}
                        >
                            {/* timeline */}
                            <div className="flex items-center relative">
                                <div
                                    className="w-full h-2 bg-slate-100 absolute top-0 rounded-lg"
                                    id="timeline"
                                    onClick={onTimelineClick}
                                >
                                    <div
                                        style={{ width: `${loadedProgress}%` }}
                                        className="h-full bg-cyan-200 rounded-lg"
                                    ></div>
                                    <div
                                        style={{
                                            width: `${(currentTime /
                                                //@ts-ignore
                                                ref.current?.duration) *
                                                100
                                                }%`,
                                        }}
                                        className="h-full bg-red-500 absolute top-0 rounded-lg"
                                    ></div>
                                </div>
                            </div>

                            {/* control */}
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                    {/* play pause button */}
                                    <div className="flex items-center">
                                        <div
                                            className="text-2xl cursor-pointer"
                                            onClick={handlePlayPause}
                                        >
                                            {ref.current?.paused ? (
                                                <BsFillPlayFill />
                                            ) : (
                                                <BsFillPauseFill />
                                            )}
                                        </div>
                                        <div className="text-2xl cursor-pointer">
                                            <MdSkipNext />
                                        </div>
                                    </div>
                                    {/* next button */}
                                    <div className="flex items-center gap-1">
                                        <div
                                            className="text-lg cursor-pointer"
                                            onClick={() => {
                                                // if (ref.current) {
                                                //     if (
                                                //         ref.current.volume > 0
                                                //     ) {
                                                //         ref.current.volume = 0;
                                                //     } else {
                                                //         ref.current.volume =
                                                //             volume / 100;
                                                //     }
                                                // }
                                            }}
                                        >
                                            <VolumeIcon volume={volume} />
                                        </div>

                                        {/* @kitsuneremi khẹc */}
                                        <Slider
                                            //@ts-ignore
                                            tooltip={{ formatter }}
                                            value={volume}
                                            onChange={(e) => setVolume(e)}
                                            className="w-24"
                                        />
                                    </div>

                                    {/* video time/duration */}
                                    <div className="flex items-center max-sm:hidden">
                                        {ref.current && (
                                            <p className="text-slate-200">
                                                {videoTimeFormater(
                                                    Number.parseInt(
                                                        ref.current?.currentTime.toFixed(
                                                            0
                                                        )
                                                    ),
                                                    isNaN(ref.current?.duration)
                                                        ? 0
                                                        : Number.parseInt(
                                                            ref.current?.duration.toFixed(
                                                                0
                                                            )
                                                        )
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 items-center">
                                    <Dropdown
                                        menu={{ items }}
                                        placement="topRight"
                                    >
                                        <a onClick={(e) => e.preventDefault()}>
                                            <div className="text-xl cursor-pointer flex items-center">
                                                <AiFillSetting />
                                            </div>
                                        </a>
                                    </Dropdown>
                                    <div
                                        className="text-md cursor-pointer flex items-center"
                                        onClick={() => setFullscreen(prev => { return !prev })}
                                    >
                                        {fullscreen ? (
                                            <BsFullscreenExit />
                                        ) : (
                                            <BsArrowsFullscreen />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`${hide ? "" : "bg-controls"
                                } absolute bottom-0 w-full h-[20%] z-10`}
                        />
                    </div>
                    <Expand fullscreen videoData={videoData} />
                </div>
                <div className="lg:flex flex-grow w-full flex-1 px-5 pt-3">
                    <VideoSuggestPrefetch
                        channelData={videoData.channelData}
                        videoId={videoData.videoData.id}
                    />
                </div>
            </div>
        </div>
    );
}


const VolumeIcon = ({ volume }: { volume: number }) => {
    if (volume == 0) {
        return <ImVolumeMute2 />;
    } else if (volume > 75) {
        return <ImVolumeHigh />;
    } else if (volume > 50) {
        return <ImVolumeMedium />;
    } else if (volume > 25) {
        return <ImVolumeLow />;
    } else {
        return <ImVolumeMute />;
    }
};