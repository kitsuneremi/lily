import Navbar from "@/components/own/navbar"
import Sidebar from '@/components/own/settingsidebar'
export default function Layout({ children }: { children: React.ReactNode }) {


    return (
        <div className="">
            <Navbar />
            <div className="flex pt-16 gap-4">
                <Sidebar />
                {children}
            </div>
        </div>

    )

}