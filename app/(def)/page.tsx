import type { Metadata } from 'next'
import HomePage from '@/indirect/home/home'
import prisma from '@/lib/prisma'
import { baseURL } from '@/lib/functional'

export const metadata: Metadata = {
  title: 'home page',
  description: 'home page desciption'
}

const GetAllVideo = async function () {
  const list = await fetch(`${baseURL}/api/video/all`, {
    method: 'GET',
    next: {
      revalidate: 10
    }
  })
  if (list.ok) {
    return await list.json()
  } else {
    return null
  }

}

export default async function Home() {

  const t: any = await GetAllVideo();

  return (
    <HomePage listVideo={t}></HomePage>
  )
}
