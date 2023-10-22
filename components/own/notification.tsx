'use client'

import { baseURL } from "@/lib/functional"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

export default function NotificationToast() {

    const { data: session } = useSession();

    useEffect(() => {
        if(session){
            //@ts-ignore
            fetch(`${baseURL}/api/notifications?accountId=${session.user.id}`, {
                next: {
                    revalidate: 5
                }
            })
        }
    }, [''])

    return (
        <></>
    )
}