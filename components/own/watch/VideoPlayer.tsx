'use client'
import Plyr, { PlyrProps, PlyrInstance, APITypes } from "plyr-react";
// import "plyr/dist/plyr.css";
import "plyr-react/plyr.css";
import Hls from "hls.js";
import { useRef, useEffect, useState } from 'react'
import { VideoDataType, BigVideoDataType } from "@/type/type";
import { memo } from "react";
import { baseURL } from "@/lib/functional";

type defaultOption = {
    controls?: string[]
    qualitys?: {
        default: number,
        options: number[],
        forced: boolean,
        onChange?: Function
    }
}

const Player = ({ videoData }: { videoData: BigVideoDataType }) => {
    const src = `http://118.68.229.104:5001/api/merge/${videoData.videoData.link}/1080`
    // const src = `http://42.112.215.156:5001/api/live/eeee`
    const ref = useRef<APITypes>(null);



    useEffect(() => {
        const loadVideo = async () => {
            const video = document.getElementById("plyr") as HTMLVideoElement;
            var hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            // @ts-ignore
            ref.current!.plyr.media = video;

            const defaultOptions: defaultOption = { controls: [] }

            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                // const availableQuality = hls.levels.map((l) => l.height);
                // defaultOptions.controls = [
                //     'play-large',
                //     'restart',
                //     'rewind',
                //     'play',
                //     'fast-forward',
                //     'progress',
                //     'current-time',
                //     'duration',
                //     'mute',
                //     'volume',
                //     'captions',
                //     'settings',
                //     'pip',
                //     'airplay',
                //     'fullscreen'
                // ];
                // defaultOptions.qualitys = {
                //     default: availableQuality[0],
                //     options: availableQuality,
                //     forced: true,
                //     // onChange: updateQuality
                // };
                //@ts-ignore
                (ref.current?.plyr as PlyrInstance).play();
            });

            // const updateQuality = (newQuality: number) => {
            //     // Sử dụng hàm hls.levels để tìm index của chất lượng mới dựa trên newQuality.
            //     const newIndex = hls.levels.findIndex((l) => l.height === newQuality);

            //     // Nếu tìm thấy index hợp lệ, hãy cập nhật chất lượng trong HLS.
            //     if (newIndex !== -1) {
            //         hls.currentLevel = newIndex;
            //     }
            // };
        };
        loadVideo();
    }, []);

    const handlePlayPause = () => {

        if (ref && ref.current && ref.current?.plyr && (ref.current?.plyr as Plyr).playing) {
            // (ref.current?.plyr as Plyr).pause()

        } else if ((ref.current?.plyr as Plyr) && !(ref.current?.plyr as Plyr).playing) {
            // (ref.current?.plyr as Plyr).play()
        }
        (ref.current?.plyr as Plyr).fullscreen.enter()
    }

    return (
        // <div className="rounded-lg mt-3 relative pt-[56.25%]">
        <div className="relative">
            <Plyr
                ref={ref}
                // source={{
                //     type: "video",
                //     sources: [
                //         {
                //             src: src,
                //             type: "application/x-mpegURL",
                //         },
                //     ],
                // }}
                // source={{} as PlyrProps["source"]}
                source={null}
                id="plyr"
            />
            {/* <div className="absolute bottom-0 w-full h-10 justify-between items-center">
                <button className="text-white" onClick={() => { handlePlayPause() }}>{(ref.current?.plyr as Plyr)?.playing ? 'pause' : 'play'}</button>
            </div> */}
        </div>
        // </div>
    )

}


export default Player