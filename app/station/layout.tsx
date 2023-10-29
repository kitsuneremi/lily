import Sidebar from "@/components/own/studio/sidebar";
import Navbar from "@/components/own/studio/navbar";
import { Metadata } from "next";
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

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-screen h-screen">
            <Navbar />
            <div className="flex h-[calc(100vh-64px)]">
                <Sidebar />
                {children}
            </div>
        </div>
    );
}
