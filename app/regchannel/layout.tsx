import Navbar from "@/components/own/navbar"
import Sidebar from '@/components/own/sidebar'
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'register page',
    description: 'register page'
}

export default function Layout({ children }: { children: React.ReactElement }) {
    return (
        <div className='w-full h-screen flex flex-col'>
            <div className={`flex justify-between w-full px-10 max-lg:px-4 z-10`}>
                <Navbar></Navbar>
            </div>
            <div className="flex h-[calc(100vh-64px)] relative mt-16">
                <Sidebar />
                {children}
            </div>
        </div>
    )
}