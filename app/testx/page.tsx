'use client'
import { useToast } from "@/components/ui/use-toast"
import { baseURL } from "@/lib/functional"
import axios from "axios"
import Link from "next/link"
export default function Page(){

    const {toast} = useToast();

    const handleClick = () => {
        axios.post(`http://localhost:5001/api/test`).then(res => {toast({title: 'ok', description: res.data})})
    }

    return (
        <div className="flex gap-3">
            <button onClick={handleClick}>send</button>
            <Link href={'/'}>home</Link>
        </div>
    )
}