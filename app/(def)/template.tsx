// import Navbar from "@/components/own/Navbar";
import Sidebar from "@/components/own/defaultSidebar";
import dynamic from "next/dynamic";
const Navbar = dynamic(() => import("@/components/own/Navbar"));

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full flex flex-col h-[100dvh]">
            <div className="w-screen h-16 flex justify-between fixed top-0 left-0 px-3 lg:px-8 py-4 bg-white dark:bg-[#020817] z-10">
                <Navbar />
            </div>
            <div className="flex mt-16 h-[calc(100vh-64px)] overflow-y-clip">
                <Sidebar />
                {children}
            </div>
        </div>
    );
}
