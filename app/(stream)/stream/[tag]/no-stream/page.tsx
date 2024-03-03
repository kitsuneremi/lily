import { Metadata } from "next"

type Props = {
    params: { tag: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
    title: `không tìm thấy buổi phát trực tiếp`,
    description: `không tìm thấy buổi phát trực tiếp`
}

export default function Page({ params, searchParams }: Props) {

    return <div className="flex w-screen justify-center items-center">
        <p className="font-bold text-lg hover:scale-105">@{params.tag} chưa livestream, quay lại sau nhé</p>
    </div>
}