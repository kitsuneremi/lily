import { Metadata } from "next"
import StreamPage from '@/components/own/studio/upload/livestream/page'
import { Session, getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ChannelDataType } from "@/types/type"
import { baseURL } from "@/lib/functional"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: 'thiết lập buổi phát trực tiếp',
    description: 'thiết lập buổi phát trực tiếp'
}

const fetchChannelData = async (session: Session) => {
    const data = await fetch(`${baseURL}/api/channel/data?accountId=${session.user.id}`,{
        next:{
            revalidate: 5
        }
    })

    return await data.json();
}

export default async function Page() {

    const session = await getServerSession(authOptions);
    if (session) {
        const channelData: ChannelDataType = await fetchChannelData(session);
        return (
            <>
                <StreamPage session={session} channelData={channelData}></StreamPage>
            </>
        )
    } else {
        redirect('/register')
    }

}