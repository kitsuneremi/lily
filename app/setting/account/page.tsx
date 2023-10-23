import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { ChannelDataType, SessionDataType } from "@/type/type"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { baseURL } from '@/lib/functional'

const fetchChannelData = async (accountId: number) => {
    const data = await fetch(`${baseURL}/api/channel/data?accountId=${accountId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return data.json();
}

export default async function Page() {
    const session: SessionDataType | null = await getServerSession(authOptions);
    const channelData = session ? await fetchChannelData(session.user.id) : null;

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex">
                <div className="flex flex-col justify-around gap-2">
                    <p className='text-lg font-bold'>
                        Tài khoản
                    </p>
                    <div className="flex flex-col gap-2">
                        {session ? <p>
                            Bạn đang đăng nhập với tài khoản {session?.user?.email}
                        </p> : <>
                            <p>
                                Bạn chưa đăng nhập
                            </p>
                            <Link href="/register">Đăng nhập</Link>
                        </>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className='text-lg font-semibold'>Kênh faketube của bạn</p>
                        <p>Đây là sự hiện diện công khai của bạn trên YouTube. Bạn cần có một kênh để tải video của riêng mình lên, bình luận về các video hoặc tạo danh sách phát.</p>
                        <div className="flex lg:gap-7 md:gap-5 sm:gap-3">
                            <p>
                                Kênh của bạn
                            </p>
                            <div className="flex flex-col gap-2">
                                {channelData ? <>
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10">
                                            <Image alt='' fill src={'https://github.com/shadcn.png'} sizes={'1/1'} className="rounded-full" />
                                        </div>
                                        <p>{channelData?.name}</p>
                                    </div>

                                    <Link href={'/station'} className="text-cyan-600">Quản lý kênh của bạn</Link>
                                </> : <>
                                    <Link href={'/regchannel'}>Tạo 1 kênh để đăng tải nội dung mình thích</Link>
                                </>}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}