"use client";
import NextImage from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { PinturaEditorModal } from "@pqina/react-pintura";
import { uploadBytes, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { baseURL } from "@/lib/functional";

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
import { redirect, useRouter } from "next/navigation";

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
    const [originalAvatar, setOriginalAvatar] = useState<{
        file: File;
        width: number;
        height: number;
    } | null>(null);

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
                        ratio: 1 / 1,
                        num: 0,
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

    const handleEditImage = ({
        file,
        ratio,
        num,
    }: {
        file: File;
        ratio: number;
        num: number;
    }) => {
        setVisible(true);
        setTimeout(() => {
            if (PinturaRef && PinturaRef.current) {
                PinturaRef.current.editor
                    //@ts-ignore
                    .loadImage(file, { imageCropAspectRatio: ratio })
                    .then((imageReaderResult) => {
                        // Logs loaded image data
                        // console.log(imageReaderResult);
                    });
            }
        }, 1000);
    };

    return (
        <div className="flex flex-1 flex-col lg:flex-row gap-4 px-12 pt-12">
            <div className="flex flex-col gap-2">
                <p>Chọn ảnh chính cho kênh</p>
                <div
                    {...getRootAvatarProps()}
                    className="h-12 border-[1px] border-cyan-900 border-dashed flex items-center text-center justify-center"
                >
                    <input
                        {...getAvatarInputProps()}
                        className="w-full h-full"
                    />
                    {isAvatarDragActive ? (
                        <p className="text-red-500">Thả ảnh tại đây.</p>
                    ) : (
                        <div className="flex gap-1">
                            {originalAvatar ? (
                                <p>{originalAvatar.file.name}</p>
                            ) : (
                                <>
                                    <p className="max-lg:hidden">
                                        Kéo thả hoặc
                                    </p>
                                    <p>bấm để chọn file ảnh</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
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
                            width: com.imageState.crop?.width,
                            //@ts-ignore
                            height: com.imageState.crop?.height,
                        });
                    }}
                />
            )}
        </div>
    );
}
