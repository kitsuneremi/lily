'use client'

import { baseURL } from "@/lib/functional"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useToast } from "../ui/use-toast";

export default function NotificationToast() {

    const { data: session } = useSession();

    // useEffect(() => {
    //     let test = new EventSource('http://localhost:5001/api/event');

    //     test.onmessage = (event) => {
    //         console.log(event.data)
    //     }
    // }, [''])

    return (
        <></>
    )
}