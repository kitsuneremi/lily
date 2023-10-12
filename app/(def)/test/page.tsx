'use client'
import React, { useState, useCallback, useEffect } from "react";

// react-pintura
import { PinturaEditorModal } from "@pqina/react-pintura";
import { useDropzone, Accept } from 'react-dropzone'
// pintura
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

import NextImage from "next/image";


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

export default function ExampleModal() {
    // modal
    const [visible, setVisible] = useState(false);

    const [originalAvatar, setOriginalAvatar] = useState<{ file: File, width: number, height: number } | null>(null);

    const onAvatarDrop = useCallback((acceptedFiles: File[]) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const image = new Image();
            //@ts-ignore
            image.src = event.target!.result;

            image.onload = () => {
                setOriginalAvatar({ file: acceptedFiles[0], width: image.width, height: image.height })
                console.log(image.width, image.height)
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

    useEffect(() => {
        console.log(originalAvatar)
    }, [originalAvatar])

    return (
        <div>
            <div {...getRootAvatarProps()} className='h-12 border-[1px] border-cyan-900 border-dashed flex items-center text-center justify-center'>
                <input {...getAvatarInputProps()} className='w-full h-full' />
                {
                    isAvatarDragActive ?
                        <p className="text-red-500">Thả ảnh tại đây.</p> :
                        <div className="flex gap-1"><p className="max-lg:hidden">Kéo thả hoặc</p>bấm để chọn file ảnh</div>
                }
            </div>

            <p>
                {originalAvatar?.file && <button onClick={() => setVisible(true)}>Chỉnh sửa ảnh</button>}
            </p>

            {visible && originalAvatar && (
                <PinturaEditorModal
                    {...editorDefaults}
                    imageCropAspectRatio={1 / 1}
                    src={originalAvatar.file}
                    onLoad={(res) => console.log(res)}
                    onHide={() => setVisible(false)}
                    //@ts-ignore
                    onProcess={(com) => { console.log(com); setOriginalAvatar({ file: com.dest, width: com.imageState.crop?.width, height: com.imageState.crop?.height}) }}

                />
            )}

            <div className="relative w-32 h-32">
                {originalAvatar && originalAvatar.height == originalAvatar.width && <NextImage src={URL.createObjectURL(originalAvatar.file)} alt='' fill />}
            </div>
        </div>
    );
}
