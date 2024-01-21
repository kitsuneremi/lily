import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AiOutlineUpload } from 'react-icons/ai'
import Link from 'next/link'

export default function UploadBox() {
    return (
        <div className="flex items-center justify-center ">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className="text-2xl lg:text-3xl"><AiOutlineUpload /></div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Đăng tải nội dung</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Link href="/station/upload/video">
                            Nội dung video
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="/station/upload/stream">
                            Sự kiện phát trực tiếp
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href={"/station/upload/party"}>
                            Phòng chiếu phim ( đang phát triển )
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}