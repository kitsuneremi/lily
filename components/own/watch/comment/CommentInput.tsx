'use server'

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

export const handleSubmit = async (formData: FormData) => {
    const content = formData.get('cmt')?.toString()
    const videoId = formData.get('videoId')?.toString()
    const accountId = formData.get('accountId')?.toString()
    const videoLink = formData.get('videoLink')?.toString()
    if (content && videoId && accountId) {
        const comment = await prisma.comment.create({
            data: {
                content: content,
                accountId: Number.parseInt(accountId),
                videoId: Number.parseInt(videoId),
                status: 0,
            }
        })
        revalidatePath(`/watch/${videoLink}`, 'page')
        console.log(comment)
    }

}

