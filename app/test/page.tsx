'use client'
import { useState, useRef, useEffect } from 'react';
import Player from '@/components/own/watch/VideoPlayer'
export default function ScrollableDivs() {


    return (
        <div className='w-3/4 h-3/4'>
            <Player videoData={null} />
        </div>
    );
}
