import { auth } from '@/auth'
export default async function TestPage() {
    const session = await auth();
    console.log(session)
    return (
        <div>
            {JSON.stringify(session?.user)}
        </div>
    )

}