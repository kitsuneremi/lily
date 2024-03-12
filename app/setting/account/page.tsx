import { auth } from '@/auth'
import ChildPage from '@/components/own/setting/account/Page'
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

const fetchChannelData = async (accountId: number) => {
    const data = await prisma.account.findUnique({
        where: {
            id: accountId
        }
    })

    return data
};

export default async function Page() {
    const session = await auth();
    if(!session) return redirect('/login');
    const channelData = await fetchChannelData(session.user.id);

    return (
        <div className="flex-1 flex flex-col">
            {/* @ts-ignore */}
            <ChildPage channelData={channelData} />
        </div>
    );
}
