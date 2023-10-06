import { storage } from "@/lib/firebase"
import { getDownloadURL, ref } from "firebase/storage"
export async function GET(request: Request) {
    const url = new URL(request.url)
    const params = {
        link: url.searchParams.get('link') || ""
    }
    if (params.link == "") {
        return new Response(JSON.stringify(null))
    }
    const videoStorageRef = ref(storage, `/video/videos/${params.link}`)
    const src = await getDownloadURL(videoStorageRef)

    return new Response(JSON.stringify({
        url: src
    }))

}