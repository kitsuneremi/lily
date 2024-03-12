import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { fileURL } from '@/lib/functional'
import { Media } from '@/prisma/type';

const genlink = ({ type, link }: { type: number, link: string }) => {
    if (type == 0) {
        return `/merge/${link}/index`
    } else if (type == 1) {
        return `/live/${link}`
    } else {
        return `merge/${link}/live`
    }
}


const QuickPlayer = (
    {
        className,
        mediaData
    }: {className: string, mediaData: Media}) => {
    const videoRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null)

    const videoJsOptions = {
        autoplay: true,
        controls: false,
        responsive: true,
        liveui: false,
        fluid: false,
        islive: mediaData.isLive,
        sources: [{
            src: fileURL + "/api/" + genlink({ type: mediaData.mediaType, link: mediaData.link }),
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
                videoElement.classList.add('w-full');
                videoElement.classList.add('h-full');
                videoRef.current.appendChild(videoElement);
                videoElement.style.width = '100%';
                videoElement.style.height = '100%';
                const player = playerRef.current = videojs(videoElement, videoJsOptions, () => {
                    videojs.log('player is ready');
                    handlePlayerReady(player);
                });

                // You could update an existing player in the `else` block here
                // on prop change, for example:
            } else {
                const player = playerRef.current;
                //@ts-ignore
                player.autoplay(options.autoplay);
                //@ts-ignore
                player.src(options.sources);
            }
        }
    }, []);

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
        <div data-vjs-player className={className}>
            <div ref={videoRef} className='w-full h-full' />
        </div>
    );
}

export default QuickPlayer;