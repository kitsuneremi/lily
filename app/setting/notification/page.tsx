import { ChannelDataType, SessionDataType } from "@/type/type"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
export default async function Page() {

    const session: SessionDataType | null = await getServerSession(authOptions);

    return (
        <div className="flex-1 flex justify-center">
            <div className="w-max flex flex-col gap-3 lg:max-w-[60vw]">
                <div className="flex flex-col gap-3">
                    <p className="text-lg font-bold">Thông báo</p>

                    <div className="flex flex-col">
                        <p>Chọn cách bạn và thời gian nhận thông báo</p>
                        <p>Chọn thông báo đẩy và thông báo qua email</p>
                    </div>
                </div>
                <div className="relative w-full h-1 after:absolute after:w-[90%] after:h-[1px] after:bg-slate-600 after:bottom-0 after:left-[5%]"></div>
                <div>
                    <div>
                        <p className="font-semibold text-lg">Chung</p>
                        <p>Quản lý thông báo trên màn hình và trên thiết bị di động</p>
                    </div>

                    <div>
                        <p className="font-semibold">Tùy chọn của bạn</p>
                        <div></div>
                    </div>
                </div>
                <div className="relative w-full h-1 after:absolute after:w-[90%] after:h-[1px] after:bg-slate-600 after:bottom-0 after:left-[5%]"></div>
                <div>
                    <div>
                        <p className="font-semibold text-lg">Thông báo qua email</p>
                        <p>Các email của bạn được gửi đến {session ? session.user.email : 'email đã đăng ký tài khoản của bạn'}. Để hủy đăng ký nhận một email, hãy nhấp vào đường liên kết "Hủy đăng ký" ở cuối email đó. Tìm hiểu thêm về email từ fakeTube.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}