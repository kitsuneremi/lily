'use client'
import { useToast } from '@/components/ui/use-toast'
import Image from 'next/image';
export default function Page() {
    const { toast } = useToast();

    const handlePost = () => {
        toast({
            title: 'ý kiến của bạn đã được ghi nhận'
        })
    }

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-fit h-fit">
                <textarea className="w-[500px] max-w-[80vw] min-h-[240px] rounded-lg">

                </textarea>
                <div className="flex gap-5 h-max justify-around">
                    <Image src='https://i.imgflip.com/5rh6bx.png' alt='' width={160} height={160} className="rounded-lg" />
                    <div className="h-28 flex items-center"><button className='px-3 py-1 rounded-lg bg-cyan-500' onClick={handlePost}>Đóng góp ý kiến của bạn</button></div>
                </div>
            </div>
        </div>
    )
}