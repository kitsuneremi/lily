import Navbar from "@/components/own/navbar"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'register page',
    description: 'register page'
}

export default function Layout({ children }: { children: React.ReactElement }){
    return (
        <>{children}</>
    )
}