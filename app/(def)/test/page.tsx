'use client'
import { authOptions } from "@/lib/auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function TestPage() {
    const { data: session } = useSession();
    useEffect(() => {
        console.log(session)
    }, [session])

    return (
        <div>
            {session?.user.email}
        </div>
    )

}