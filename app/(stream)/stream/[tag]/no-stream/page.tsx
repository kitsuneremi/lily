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


    return <div>
        {params.tag} chưa livestream, quay lại sau nhé
    </div>
}