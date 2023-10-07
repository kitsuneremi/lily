import { redirect } from "next/navigation"
import type { Metadata, ResolvingMetadata } from 'next'



export default async function Page({params}: {params: {tagName: string}}) {
    redirect(`/channel/${params.tagName}/home`)
}