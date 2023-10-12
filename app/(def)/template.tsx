import Navbar from '@/components/own/navbar'
import Sidebar from '@/components/own/sidebar';
export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className='w-full flex flex-col h-screen'>
            <Navbar />
            <div className='flex mt-16 h-[calc(100vh-64px)] overflow-y-clip'>
                <Sidebar />
                {children}
            </div>
        </div>
    )
}