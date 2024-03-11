import Sidebar from "@/components/own/studio/sidebar";
import Navbar from "@/components/own/studio/navbar";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from 'next/navigation'
import { baseURL, RedirectIfNotAuthen } from "@/lib/functional";

export const medata: Metadata = {
    title: "studio page",
    description: "studio page",
};

const fetchChannelData = async (id: number) => {
    try {
        const data = await fetch(`${baseURL}/api/channel/data?accountId=${id}`, {
            method: 'GET',
        });
        return await data.json();
    } catch (error) {
        console.log(error)
        return null;
    }

}

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {

    const session = await auth();
    if (session) {
        const channelData = await fetchChannelData(session.user.id)
        if (channelData) {
            return (
                <div className="w-screen h-screen">
                    <Navbar />
                    <div className="flex h-[calc(100vh-64px)]">
                        <Sidebar />
                        {children}
                    </div>
                </div>
            );
        } else {
            return redirect('/regchannel');
        }
    } else {
        RedirectIfNotAuthen({ callback: "/station" })
        return
    }

}
