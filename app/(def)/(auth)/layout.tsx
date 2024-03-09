import { auth } from "@/auth"
import Navbar from "@/components/own/Navbar"
import { Metadata } from "next"
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: 'register page',
    description: 'register page'
}

export default async function Layout({ children }: { children: React.ReactElement }) {

    const session = await auth();
    if(session && session?.user){
        return redirect('/')
    }

    return (
        <div className="w-full h-full space-x-8 flex items-center justify-center">
            <div className="w-[500px] h-fit p-6 mt-5">{children}</div>
        </div>
    )
}