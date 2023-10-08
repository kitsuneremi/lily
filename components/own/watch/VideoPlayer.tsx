'use client'
import Plyr, { PlyrProps, PlyrInstance } from "plyr-react";
import "plyr/dist/plyr.css";
import Hls from "hls.js";
import { useRef, useEffect } from 'react'
import { VideoDataType, BigVideoDataType } from "@/type/type";
import { memo } from "react";

type defaultOption = {
    controls?: string[]
    qualitys?: {
        default: number,
        options: number[],
        forced: boolean,
        onChange: Function
    }
}

const Player = ({ videoData }: { videoData: BigVideoDataType }) => {
    const src = `http://42.112.184.47:5001/api/merge/${videoData.videoData.link}/1080`

    const videoRef = useRef(null)

    useEffect(() => {
        const loadVideo = async () => {
            const video = document.getElementById("plyr") as HTMLVideoElement;
            var hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            // @ts-ignore
            videoRef.current!.plyr.media = video;

            const defaultOptions: defaultOption = { controls: [] }

            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                const availableQuality = hls.levels.map((l) => l.height);
                defaultOptions.controls = [
                    'play-large',
                    'restart',
                    'rewind',
                    'play',
                    'fast-forward',
                    'progress',
                    'current-time',
                    'duration',
                    'mute',
                    'volume',
                    'captions',
                    'settings',
                    'pip',
                    'airplay',
                    'fullscreen'
                ];
                defaultOptions.qualitys = {
                    default: availableQuality[0],
                    options: availableQuality,
                    forced: true,
                    onChange: updateQuality
                };
                //@ts-ignore
                (videoRef.current?.plyr as PlyrInstance).play();
            });

            const updateQuality = (newQuality: number) => {
                // Sử dụng hàm hls.levels để tìm index của chất lượng mới dựa trên newQuality.
                const newIndex = hls.levels.findIndex((l) => l.height === newQuality);

                // Nếu tìm thấy index hợp lệ, hãy cập nhật chất lượng trong HLS.
                if (newIndex !== -1) {
                    hls.currentLevel = newIndex;
                }
            };
        };
        loadVideo();
    }, []);

    return (
        <div className="rounded-lg mt-3 relative pt-[56.25%]">
            <Plyr
                ref={videoRef}
                // source={{
                //     type: "video",
                //     sources: [
                //         {
                //             src: src,
                //             type: "application/x-mpegURL",
                //         },
                //     ],
                // }}
                source={{} as PlyrProps["source"]}
                id="plyr"
                className="absolute top-0"
            />
        </div>
    )

}


export default memo(Player)