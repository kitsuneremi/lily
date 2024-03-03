import { Metadata } from "next"
type Props = {
    searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
    title: `không tìm thấy buổi phát trực tiếp`,
    description: `không tìm thấy buổi phát trực tiếp`
}

export default function Page({ searchParams }: Props) {
    console.log(searchParams)
    return <div>không tìm thấy kênh này, hãy kiểm tra lại</div>
}