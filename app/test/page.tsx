'use client'
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Navbar from "@/components/own/navbar"
import Sidebar from "@/components/own/absoluteSidebar"

export default function TestPage() {

    const {data: session} = useSession()

    useEffect(() => {
        console.log(session)
    }, [session])

    return (
        <p>ccc</p>
    )

}