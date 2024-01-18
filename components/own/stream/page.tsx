'use client'
import { fileURL } from '@/lib/functional';
import { type MediaDataType, BigVideoDataType, LiveData, ChannelDataType } from '@/types/type';
import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default function LivePlayer({ name, streamData }: { name: string, streamData: MediaDataType }) {
    const videoRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null)

    const videoJsOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        liveui: true,
        fluid: true,
        islive: streamData.isLive,
        sources: [{
            src: `${fileURL}/api/live/${name}`,
            type: 'application/x-mpegURL'
        }]
    };

    useEffect(() => {
        if (videoRef && videoRef.current) {
            // Make sure Video.js player is only initialized once
            if (!playerRef.current) {
                // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
                const videoElement = document.createElement("video-js");

                videoElement.classList.add('vjs-big-play-centered');
                videoRef.current.appendChild(videoElement);

                //@ts-ignore
                const player = playerRef.current = videojs(videoElement, videoJsOptions, () => {
                    videojs.log('player is ready');
                    handlePlayerReady(player);
                });

                // You could update an existing player in the `else` block here
                // on prop change, for example:
            } else {
                const player = playerRef.current;
                //@ts-ignore
                player.autoplay(videoJsOptions.autoplay);
                //@ts-ignore
                player.src(videoJsOptions.sources);
            }
        }
    }, []);

    useEffect(() => {
        console.log(playerRef.current)
    }, [playerRef.current])

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        if (playerRef && playerRef.current) {
            const player = playerRef.current;

            return () => {
                if (player && !player.isDisposed()) {
                    player.dispose();
                    playerRef.current = null;
                }
            };
        }
    }, [playerRef]);

    const handlePlayerReady = (player: any) => {
        playerRef.current = player;

        // You can handle player events here, for example:
        player.on('waiting', () => {
            videojs.log('player is waiting');
        });

        player.on('dispose', () => {
            videojs.log('player will dispose');
        });
    };

    return (
        <div data-vjs-player className='w-full h-full absolute top-0 left-0'>
            <div ref={videoRef} />
        </div>
    );
} 