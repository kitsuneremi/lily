import Navbar from "@/components/own/navbar"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'register page',
    description: 'register page'
}

export default ({ children }: { children: React.ReactElement }) => {
    return (
        <div className='w-full h-screen flex flex-col'>
            <div className={`flex justify-between w-full px-10 max-lg:px-4 z-10`}>
                <Navbar></Navbar>
            </div>
            {children}
        </div>
    )
}