'use client'
import Image from "next/image"
import { useState, useCallback, useRef, useEffect } from "react"
import { useDropzone, Accept } from 'react-dropzone'

import { uploadBytes, ref } from 'firebase/storage'
import { storage } from '@/lib/firebase'
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link";

import { AiOutlineCopy } from 'react-icons/ai'
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { useSession } from "next-auth/react"



function makeid() {
    let length = 8;
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

//   const getFileExt = (fileName) => {
//     return fileName.name.substring(fileName.name.lastIndexOf(".") + 1);
//   };




export default function Page() {

    const [name, setName] = useState<string>('')
    const [des, setDes] = useState<string>('')
    const [link, setLink] = useState<string>('')

    const [videoFile, setVideoFile] = useState<File>();
    const [originalThumbnail, setOriginalThumbnail] = useState<File>();
    const [accept, setAccept] = useState<boolean>(false)

    const [previewVideo, setPreviewVideo] = useState<string>();

    const { toast } = useToast()

    const { data: session } = useSession()

    useEffect(() => {
        setLink(makeid())
    }, [])
    const onAvatarDrop = useCallback((acceptedFiles: File[]) => {
        setVideoFile(acceptedFiles[0])
        if (acceptedFiles[0]) {
            setPreviewVideo(URL.createObjectURL(acceptedFiles[0]))
        }
    }, [])

    const onThumbnailDrop = useCallback((acceptedFiles: File[]) => {
        setOriginalThumbnail(acceptedFiles[0])
    }, [])


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onAvatarDrop,
        accept: {
            'video/*': []
        },
        maxFiles: 1,
        multiple: false
    })


    const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps, isDragActive: isThumbnailDragActive } = useDropzone({
        onDrop: onThumbnailDrop,
        accept: {
            'image/*': []
        },
        maxFiles: 1,
        multiple: false
    })



    const handleFinish = async () => {
        if (session && session.user) {
            if (name.trim().length == 0) {
                toast({
                    title: 'điền tên video'
                })
            } else if (!videoFile) {
                toast({
                    title: 'Chọn video'
                })
            } else if (!originalThumbnail) {
                toast({
                    title: 'Chọn ảnh'
                })
            } else {
                const formData: FormData = new FormData();
                formData.append('video', videoFile)

                const videoUpload = await axios.post('http://42.112.184.47:5001/api/decay', {
                    formData: formData
                })

                console.log(videoUpload)

                axios
                    .post("/api/video/create", {
                        title: name,
                        des: des,
                        link: link,
                        //@ts-ignore
                        channelId: session?.user.id,
                    })
                    .then((response) => {
                        console.log(response.data);
                    })
                    .catch((error) => {
                        console.error(error);
                    });

                const thumbnailStorageRef = ref(storage, `/video/thumbnails/${link}`)
                uploadBytes(thumbnailStorageRef, originalThumbnail).then(() => { console.log("thumbnail uploaded") })
            }
        }
    }


    return (
        <div className="flex flex-1 flex-shrink-0 flex-col lg:flex-row px-12">
            <div className="w-full lg:w-1/3 px-3">
                <div className="flex flex-col gap-3">
                    <p className="text-3xl font-semibold">Điền thông tin</p>
                    <div className="flex flex-col gap-3">
                        <label className="w-full flex gap-2 whitespace-nowrap">
                            Tên video
                            <input className="relative flex-1 w-32 border-b-2 border-slate-600 focus:border-slate-800 outline-none" value={name} onChange={e => setName(e.target.value)} />
                        </label>
                        <label className="w-full flex flex-col gap-2">
                            Đường dẫn
                            <div className="flex gap-2">
                                <input disabled className="relative flex-1 w-full border-b-2 border-slate-600 focus:border-slate-800 outline-none" value={`erinasaiyukii.com/watch/${link}`} />
                                <button onClick={() => { }} className="flex items-center justify-center w-7 h-7"><AiOutlineCopy /></button>
                            </div>
                        </label>
                    </div>
                    <label className="flex flex-col gap-2">
                        mô tả
                        <textarea className="w-full border-[1px] border-slate-600 rounded-sm p-1 h-fit" />
                    </label>

                    <div className="flex flex-col">
                        <p>Chọn ảnh nền</p>
                        <div {...getThumbnailRootProps()} className='h-12 border-[1px] border-cyan-900 border-dashed flex items-center text-center justify-center'>
                            <input {...getThumbnailInputProps()} className='w-full h-full' />
                            {
                                isThumbnailDragActive ?
                                    <p className="text-red-500">Thả ảnh tại đây.</p> :
                                    <div className="flex gap-1"><p className="max-lg:hidden">Kéo thả hoặc</p>bấm để chọn file ảnh</div>
                            }
                        </div>
                        <div className="flex flex-col">
                            <p>Chọn video</p>
                            <div {...getRootProps()} className='h-12 border-[1px] border-cyan-900 border-dashed flex items-center text-center justify-center'>
                                <input {...getInputProps()} className='w-full h-full' />
                                {
                                    isDragActive ?
                                        <p className="text-red-500">Thả video tại đây.</p> :
                                        <div className="flex gap-1"><p className="max-lg:hidden">Kéo thả hoặc</p>bấm để chọn file video</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="items-top flex space-x-2">
                        <input type="checkbox" id="terms1" checked={accept} onChange={e => setAccept(e.target.checked)} />
                        <div className="grid gap-1.5 leading-none h-fit">
                            <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Accept terms and conditions
                            </label>
                            <p className="text-sm text-muted-foreground font-bold">
                                You agree to our <Link className="underline text-red-500" href={'/Term'}>Terms of Service and Privacy Policy.</Link>
                            </p>
                        </div>
                    </div>
                    <div>
                        <button className={`${accept ? 'bg-gradient-to-r from bg-cyan-200 to-cyan-600 text-black' : 'bg-red-500 text-yellow-50 border-[1px] '} font-bold text-xl w-full h-10`} disabled={!accept} onClick={handleFinish}>{accept ? 'Tạo video' : 'Đồng ý với điều khoản trước!'}</button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col  px-[5%]">
                <p className="text-3xl font-semibold">Xem trước video</p>
                <div className="flex flex-col border-[1px] rounded-lg">
                    <video src={previewVideo} controls autoPlay className="lg:w-[45vw] h-fit"></video>
                </div>
            </div>
        </div>
    )
}