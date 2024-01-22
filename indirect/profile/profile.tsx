'use client'
import { useEffect } from 'react'
export default function DirectPageProfile({ profileData }: { profileData: any }) {

    useEffect(() => {
        console.log(profileData)
    }, [profileData])

    return (
        <div>

        </div>
    )
}