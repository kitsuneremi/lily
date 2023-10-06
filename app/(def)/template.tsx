import Navbar from '@/components/own/navbar'
import Sidebar from '@/components/own/sidebar';
export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className='w-full flex flex-col h-screen'>
            <Navbar />
            <div className='flex mt-16 gap-10 h-[calc(100vh-64px)] overflow-y-hidden'>
                <Sidebar />
                {children}
            </div>
        </div>
    )
}