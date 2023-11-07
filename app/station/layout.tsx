import Sidebar from "@/components/own/studio/sidebar";
import Navbar from "@/components/own/studio/navbar";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation'
import { baseURL } from "@/lib/functional";
// const channelDataFetch = async () => {
//     const channels = await prisma.channels.findFirst({
//         where: {
//             accountId: 1
//         }
//     })

//     return channels
// }

export const medata: Metadata = {
    title: "studio page",
    description: "studio page",
};

const fetchChannelData = async (id: number) => {
    const data = await fetch(`${baseURL}/api/channel/data?accountId=${id}`);
    return await data.json();
}

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {

    const session = await getServerSession(authOptions);
    if (session) {
        const channelData = await fetchChannelData(session?.user.id)
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
            return redirect('/regchannel')
        }
    } else {
        return redirect('/register')
    }

}
