'use client'

// eslint-disable-next-line import/no-anonymous-default-export
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ThemeProvider } from "@/components/theme-provider"
import ValProvider from "@/redux/provider";
import { NextUIProvider } from '@nextui-org/react'
import Notification from './notification'

// eslint-disable-next-line react/display-name
export default function Provider({ children }: { children: ReactNode }): ReactNode{
    return (
        <div>
            <ValProvider>
                <SessionProvider>
                    <Notification />
                    <ThemeProvider attribute="class" defaultTheme="light">
                        {children}
                    </ThemeProvider>
                </SessionProvider>
            </ValProvider>
        </div >
    )
}