import { Metadata } from "next"
import StreamPage from '@/components/own/studio/upload/livestream/page'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const metadata: Metadata = {
    title: 'thiết lập buổi phát trực tiếp',
    description: 'thiết lập buổi phát trực tiếp'
}

export default async function Page() {

    const session = await getServerSession(authOptions);

    return (
        <>
            <StreamPage session={session}></StreamPage>
        </>
    )

}