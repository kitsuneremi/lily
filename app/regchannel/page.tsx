'use client'
import NextImage from "next/image"
import { useState, useCallback, useRef, useEffect } from "react"
import { useDropzone, Accept } from 'react-dropzone'
import { PinturaEditorModal } from "@pqina/react-pintura";
import { uploadBytes, ref } from 'firebase/storage'
import { storage } from '@/lib/firebase'
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { useSession } from "next-auth/react"
import { baseURL } from "@/lib/functional"

import "@pqina/pintura/pintura.css";
import {
    // editor
    locale_en_gb,
    createDefaultImageReader,
    createDefaultImageWriter,
    createDefaultShapePreprocessor,

    // plugins
    setPlugins,
    plugin_crop,
    plugin_crop_locale_en_gb,
    plugin_finetune,
    plugin_finetune_locale_en_gb,
    plugin_finetune_defaults,
    plugin_filter,
    plugin_filter_locale_en_gb,
    plugin_filter_defaults,
    plugin_annotate,
    plugin_annotate_locale_en_gb,
    markup_editor_defaults,
    markup_editor_locale_en_gb,
} from "@pqina/pintura";

setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);

const editorDefaults = {
    utils: [
        "crop",
        // "finetune",
        // "filter",
        // "annotate"
    ],
    imageReader: createDefaultImageReader(),
    imageWriter: createDefaultImageWriter(),
    shapePreprocessor: createDefaultShapePreprocessor(),
    ...plugin_finetune_defaults,
    ...plugin_filter_defaults,
    ...markup_editor_defaults,
    locale: {
        ...locale_en_gb,
        ...plugin_crop_locale_en_gb,
        ...plugin_finetune_locale_en_gb,
        ...plugin_filter_locale_en_gb,
        ...plugin_annotate_locale_en_gb,
        ...markup_editor_locale_en_gb,
    },
};


export default function Page() {
    const { toast } = useToast()

    const [name, setName] = useState<string>('')
    const [tagName, setTagName] = useState<string>('')
    const [des, setDes] = useState<string>('')
    const [which, setWhich] = useState<number>(0)

    const [originalAvatar, setOriginalAvatar] = useState<{ file: File, width: number, height: number } | null>(null);
    const [originalThumbnail, setOriginalThumbnail] = useState<{ file: File, width: number, height: number } | null>(null);
    const [accept, setAccept] = useState<boolean>(false)

    const [visible, setVisible] = useState<boolean>(false)

    const { data: session } = useSession();

    const PinturaRef = useRef<PinturaEditorModal>(null)

    const onAvatarDrop = useCallback((acceptedFiles: File[]) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const image = new Image();
            //@ts-ignore
            image.src = event.target!.result;

            image.onload = () => {
                if (image.width != image.height) {
                    handleEditImage({ file: acceptedFiles[0], ratio: 1 / 1, num: 0 })
                } else {
                    setOriginalAvatar({ file: acceptedFiles[0], width: image.width, height: image.height })
                }
            }
        }
        reader.readAsDataURL(acceptedFiles[0])
    }, [])

    const onThumbnailDrop = useCallback((acceptedFiles: File[]) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const image = new Image();
            //@ts-ignore
            image.src = event.target!.result;

            image.onload = () => {
                if (image.width / image.height !== 16 / 9) {
                    handleEditImage({ file: acceptedFiles[0], ratio: 16 / 9, num: 1 })
                } else {
                    setOriginalThumbnail({ file: acceptedFiles[0], width: image.width, height: image.height })
                }
            }
        }
        reader.readAsDataURL(acceptedFiles[0])

    }, [])

    const { getRootProps: getRootAvatarProps, getInputProps: getAvatarInputProps, isDragActive: isAvatarDragActive } = useDropzone({
        onDrop: onAvatarDrop,
        accept: {
            'image/*': []
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
        multiple: false,
    })

    const handleEditImage = ({ file, ratio, num }: { file: File, ratio: number, num: number }) => {
        setVisible(true);
        setWhich(num)
        setTimeout(() => {
            if(PinturaRef && PinturaRef.current){
                PinturaRef.current.editor
                //@ts-ignore
                .loadImage(file, { imageCropAspectRatio: ratio })
                .then((imageReaderResult) => {
                    // Logs loaded image data
                    console.log(imageReaderResult);
                });
            }
        }, 1000)
    }


    const handleFinish = () => {
        if (originalAvatar && originalAvatar.height != originalAvatar.width) {
            handleEditImage({ file: originalAvatar.file, ratio: 1 / 1, num: 0 })
        }
        if (originalThumbnail && originalThumbnail.width % originalThumbnail.height != 7) {
            handleEditImage({ file: originalThumbnail.file, ratio: 16 / 9, num: 1 })
        }

        if (originalAvatar && originalThumbnail && name.trim().length > 0 && tagName.trim().length > 0 && des.trim().length > 0) {
            const avatarStorageRef = ref(storage, `/channel/avatars/${tagName}`)
            const bannerStorageRef = ref(storage, `/channel/banners/${tagName}`)
            uploadBytes(avatarStorageRef, originalAvatar.file)
            uploadBytes(bannerStorageRef, originalThumbnail.file)
            fetch(`${baseURL}/api/channel/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    //@ts-ignore
                    accountId: session?.user.id,
                    name: name,
                    des: des,
                    tagName: tagName
                })
            })
        } else {
            toast({
                title: 'Điền đủ thông tin trước',
                description: '...'
            })
        }

    }




    return (
        <div className="flex flex-col lg:flex-row px-12 pt-12 mt-16">
            <div className="w-full lg:w-1/3 px-3">
                <div className="flex flex-col gap-3">
                    <p className="text-3xl font-semibold">Điền thông tin</p>
                    <div className="grid xl:grid-cols-2 gap-3 lg:grid-cols-1 md:grid-cols-2 grid-cols-1">
                        <label className="w-full flex gap-2 whitespace-nowrap">
                            Tên kênh
                            <input className="relative flex-1 w-32 border-b-2 border-slate-600 focus:border-slate-800 outline-none" value={name} onChange={e => { if (e.target.value.length < 20) { setName(e.target.value) } }} />
                        </label>
                        <label className="w-full flex gap-2">
                            Nhãn
                            <input className="relative flex-1 w-32 border-b-2 border-slate-600 focus:border-slate-800 outline-none" value={tagName} onChange={e => { if (e.target.value.length < 12) { setTagName(e.target.value) } }} />
                        </label>
                    </div>
                    <label className="flex flex-col gap-2">
                        mô tả
                        <textarea className="w-full border-[1px] border-slate-600 rounded-sm p-1 h-fit" value={des} onChange={e => setDes(e.target.value)} />
                    </label>
                    <div className="flex flex-col">
                        <div className="flex flex-col">
                            <p>Chọn ảnh chính cho kênh</p>
                            <div {...getRootAvatarProps()} className='h-12 border-[1px] border-cyan-900 border-dashed flex items-center text-center justify-center'>
                                <input {...getAvatarInputProps()} className='w-full h-full' />
                                {
                                    isAvatarDragActive ?
                                        <p className="text-red-500">Thả ảnh tại đây.</p> :
                                        <div className="flex gap-1"><p className="max-lg:hidden">Kéo thả hoặc</p>bấm để chọn file ảnh</div>
                                }
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <p>Chọn ảnh nền cho kênh</p>
                            <div {...getThumbnailRootProps()} className='h-12 border-[1px] border-cyan-900 border-dashed flex items-center text-center justify-center'>
                                <input {...getThumbnailInputProps()} className='w-full h-full' />
                                {
                                    isThumbnailDragActive ?
                                        <p className="text-red-500">Thả ảnh tại đây.</p> :
                                        <div className="flex gap-1"><p className="max-lg:hidden">Kéo thả hoặc</p>bấm để chọn file ảnh</div>
                                }
                            </div>
                        </div>
                    </div>
                    {visible && <PinturaEditorModal
                        ref={PinturaRef}
                        {...editorDefaults}
                        onLoad={(res) => console.log(res)}
                        onHide={() => setVisible(false)}
                        //@ts-ignore
                        onProcess={(com) => { which == 0 ? setOriginalAvatar({ file: com.dest, width: com.imageState.crop?.width, height: com.imageState.crop?.height }) : setOriginalThumbnail({ file: com.dest, width: com.imageState.crop?.width, height: com.imageState.crop?.height }) }}

                    />}
                    <div className="items-top flex space-x-2">
                        <input type="checkbox" id="terms1" checked={accept} onChange={e => setAccept(e.target.checked)} />
                        <div className="grid gap-1.5 leading-none">
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
                        <button className={`${accept ? 'bg-gradient-to-r from bg-cyan-200 to-cyan-600 text-black' : 'bg-red-500 text-yellow-50 border-[1px] '} font-bold text-xl w-full h-10`} disabled={!accept} onClick={handleFinish}>{accept ? 'Tạo kênh' : 'Đồng ý với điều khoản trước!'}</button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-grow px-[5%]">
                <p className="text-3xl font-semibold">Xem trước giao diện kênh</p>
                <div className="flex flex-col border-[1px] rounded-lg">
                    <div className="w-full h-auto max-h-60">
                        <div className="relative w-full min-h-[140px] h-40">
                            {originalThumbnail && originalThumbnail.width / originalThumbnail.height === 16/9 && <NextImage src={URL.createObjectURL(originalThumbnail.file)} sizes="16/9" alt="" fill />}
                        </div>
                    </div>
                    <div className="flex gap-8 mt-2">
                        <div className="flex items-center lg:pl-[20%]">
                            <div className="w-[70px] h-[70px] relative">
                                {originalAvatar?.file && originalAvatar.height == originalAvatar.width && <NextImage src={URL.createObjectURL(originalAvatar.file)} alt="" className="rounded-full" sizes="1/1" fill />}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-2xl font-bold">{name}</p>
                            <p>@{tagName}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}