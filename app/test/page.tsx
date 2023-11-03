'use client'
import React from 'react';

// This imports the functional component from the previous sample.
import VideoJS from '@/components/own/test/VIdeojs'
import videojs from 'video.js';


type VideoJsPlayerOptions = {
    autoplay?: boolean
    techOrder?: any[];
    html5?: {};
    enableSourceset?: boolean;
    inactivityTimeout?: number;
    playbackRates?: any[];
    liveui?: boolean;
    children?: string[];
    language?: any;
    languages?: {};
    notSupportedMessage?: string;
    normalizeAutoplay?: boolean;
    fullscreen?: {
        options: {
            navigationUI: string;
        };
    };
    breakpoints?: {};
    responsive?: boolean;
    audioOnlyMode?: boolean;
    audioPosterMode?: boolean;
    controls?: boolean;
    fluid?: boolean;
    sources?: [{
        src: string,
        type: string
    }]
};

const App = () => {
    const playerRef = React.useRef(null);

    return (
        <>
            <div>Rest of app here</div>
            <VideoJS name='hi3rd'/>
            <div>Rest of app here</div>
        </>
    );
}

export default App