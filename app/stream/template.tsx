import Sidebar from "@/components/own/absoluteSidebar";
import Navbar from "@/components/own/navbar";


export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full flex flex-col h-screen overflow-y-hidden">
            <div className="w-screen h-16 flex justify-between fixed top-0 left-0 px-3 lg:px-8 py-4 bg-white dark:bg-[#020817] z-10">
                <Navbar />
            </div>
            <div className="flex mt-16 h-[calc(100vh-64px)]">
                <Sidebar />
                {children}
            </div>
        </div>
    );
}
