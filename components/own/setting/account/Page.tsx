"use client";
import NextImage from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { PinturaEditorModal } from "@pqina/react-pintura";
import Link from "next/link";
import axios from 'axios'
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
import { Skeleton } from "@/components/ui/skeleton";
import { fileURL } from "@/lib/functional";
import { useSession } from "next-auth/react";
import { Account } from "@/prisma/type";
setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);

const editorDefaults = {
    utils: [
        "crop",
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

export default function Page({
    channelData,
}: {channelData: Account}) {
    const [originalAvatar, setOriginalAvatar] = useState<{
        file: File;
        width: number;
        height: number;
    } | null>(null);

    const { data: session, status: authenStatus } = useSession();

    const [visible, setVisible] = useState<boolean>(false);

    const PinturaRef = useRef<PinturaEditorModal>(null);

    const onAvatarDrop = useCallback((acceptedFiles: File[]) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const image = new Image();
            //@ts-ignore
            image.src = event.target!.result;

            image.onload = () => {
                if (image.width != image.height) {
                    handleEditImage({
                        file: acceptedFiles[0],
                    });
                } else {
                    setOriginalAvatar({
                        file: acceptedFiles[0],
                        width: image.width,
                        height: image.height,
                    });
                }
            };
        };
        reader.readAsDataURL(acceptedFiles[0]);
    }, []);

    const {
        getRootProps: getRootAvatarProps,
        getInputProps: getAvatarInputProps,
        isDragActive: isAvatarDragActive,
    } = useDropzone({
        onDrop: onAvatarDrop,
        accept: {
            "image/*": [],
        },
        maxFiles: 1,
        multiple: false,
    });

    const handleEditImage = ({ file }: { file: File }) => {
        setVisible(true);
        setTimeout(() => {
            if (PinturaRef && PinturaRef.current) {
                PinturaRef.current.editor
                    //@ts-ignore
                    .loadImage(file, { imageCropAspectRatio: 1 / 1 })
                    .then((imageReaderResult) => {
                        // Logs loaded image data
                        // console.log(imageReaderResult);
                    });
            }
        }, 1000);
    };

    const handleUploadImage = () => {
        if (originalAvatar && originalAvatar.height == originalAvatar.width) {
            const formData = new FormData;
            formData.append("image", originalAvatar.file);
            axios.post(`${fileURL}/api/image/avatar?id=${session}`)
        }
    };

    const AccountAvatarRender = () => {
        if (authenStatus == "loading") {
            return (
                <div>
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <p className="text-center">loading...</p>
                </div>
            );
        } else {
            return <div className="relative w-24 h-24">
                <NextImage
                    alt=""
                    fill
                    src={
                        session?.user.avatarLink ? session.user.avatarLink : "https://danviet.mediacdn.vn/upload/2-2019/images/2019-04-02/Vi-sao-Kha-Banh-tro-thanh-hien-tuong-dinh-dam-tren-mang-xa-hoi-khabanh-1554192528-width660height597.jpg"
                    }
                    sizes={"1/1"}
                    className="rounded-full animate-spin"
                />
            </div>
        }
    };

    return (
        <>
            <div className="flex flex-col justify-around gap-2">
                <p className="text-lg font-bold">Tài khoản</p>
                <div className="flex flex-col gap-3">
                    {session ? (
                        <div className="flex gap-3 items-center">
                            <AccountAvatarRender />
                            <div className="flex flex-col gap-2">
                                {!session.user.avatarLink && (
                                    <>
                                        <p className="text-sm font-semibold text-slate-600">
                                            bạn chưa tải ảnh lên cho tài khoản.
                                            hãy bấm để thay đổi ảnh mặc định
                                        </p>
                                    </>
                                )}
                                {session && session.user && (
                                    <div className="flex flex-col gap-2">
                                        <p>Chọn ảnh cho tài khoản</p>
                                        <div
                                            {...getRootAvatarProps()}
                                            className="h-12 border-[1px] border-cyan-900 border-dashed flex items-center text-center justify-center"
                                        >
                                            <input
                                                {...getAvatarInputProps()}
                                                className="w-full h-full"
                                            />
                                            {isAvatarDragActive ? (
                                                <p className="text-red-500">
                                                    Thả ảnh tại đây.
                                                </p>
                                            ) : (
                                                <div className="flex gap-1">
                                                    {originalAvatar ? (
                                                        <p>
                                                            {
                                                                originalAvatar
                                                                    .file.name
                                                            }
                                                        </p>
                                                    ) : (
                                                        <>
                                                            <p className="max-lg:hidden">
                                                                Kéo thả hoặc
                                                            </p>
                                                            <p>
                                                                bấm để chọn file
                                                                ảnh
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {visible && (
                                    <PinturaEditorModal
                                        ref={PinturaRef}
                                        {...editorDefaults}
                                        onHide={() => setVisible(false)}
                                        onProcess={(com) => {
                                            console.log(com);
                                            setOriginalAvatar({
                                                file: com.dest,
                                                //@ts-ignore
                                                width: com.imageState.crop
                                                    ?.width,
                                                //@ts-ignore
                                                height: com.imageState.crop
                                                    ?.height,
                                            });
                                        }}
                                    />
                                )}
                                {originalAvatar && (
                                    <button
                                        className="px-3 py-2 bg-cyan-300"
                                        onClick={() => {
                                            handleUploadImage();
                                        }}
                                    >
                                        thay đổi ảnh
                                    </button>
                                )}
                                <p>
                                    Bạn đang đăng nhập với tài khoản{" "}
                                    {session?.user?.email}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p>Bạn chưa đăng nhập</p>
                            <Link
                                href="/register"
                                className="text-cyan-400 hover:underline"
                            >
                                Đăng nhập
                            </Link>
                        </>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-lg font-semibold">
                        Kênh faketube của bạn
                    </p>
                    <p>
                        Đây là sự hiện diện công khai của bạn trên FakeTube. Bạn
                        cần có một kênh để tải video của riêng mình lên, bình
                        luận về các video hoặc tạo danh sách phát.
                    </p>
                </div>
            </div>
        </>
    );
}
