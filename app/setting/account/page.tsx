import { auth } from '@/auth'
import { baseURL } from "@/lib/functional";
import ChildPage from '@/components/own/setting/account/Page'

const fetchChannelData = async (accountId: number) => {
    const data = await fetch(
        `${baseURL}/api/channel/data?accountId=${accountId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return data.json();
};

export default async function Page() {
    const session = await auth();
    const channelData = session
        ? await fetchChannelData(session.user.id)
        : null;

    return (
        <div className="flex-1 flex flex-col">
            <ChildPage channelData={channelData} />
        </div>
    );
}
