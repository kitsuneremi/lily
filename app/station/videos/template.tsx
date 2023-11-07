'use client'
import React from 'react';
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";
export default function Template({ children }: { children: React.ReactNode }) {
    const deviceType = {
        isFlex: useMediaQuery("(min-width: 1200px"),
        isAbsolute: useMediaQuery("(max-width: 1199px)"),
    };

    if (deviceType.isAbsolute || deviceType.isFlex) {
        return (
            <>{children}</>
        )
    }
}