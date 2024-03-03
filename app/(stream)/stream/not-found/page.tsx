import { Metadata } from "next"
type Props = {
    searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
    title: `không tìm thấy kênh này`,
    description: `không tìm thấy kênh này`
}

export default function Page({ searchParams }: Props) {
    console.log(searchParams)
    return <div className="flex w-screen justify-center items-center">
        <p className="font-bold text-lg hover:scale-105 glow">@{searchParams.tag} không tồn tại</p>
    </div>
}