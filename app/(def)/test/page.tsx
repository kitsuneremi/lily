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
import axios from "axios";


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
const getFileExt = (file: File) => {
    return file.name.substring(file.name.lastIndexOf(".") + 1);
};

export default function ExampleModal() {
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const onAvatarDrop = useCallback((acceptedFiles: File[]) => {
        setVideoFile(acceptedFiles[0])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onAvatarDrop,
        accept: {
            'video/*': []
        },
        maxFiles: 1,
        multiple: false
    })

    const handleFinish = () => {

        const formData = new FormData();
        formData.append('video', videoFile, 'test' + '.' + getFileExt(videoFile))
        formData.append('link', 'test')

        axios.post('https://file.erinasaiyukii.com/api/decay/video', formData, {
            headers: {
                ContentType: 'multipart/form-data'
            }
        })
    }




    return (
        <div>
            <div {...getRootProps()} className='h-12 border-[1px] border-cyan-900 border-dashed flex items-center text-center justify-center'>
                <input {...getInputProps()} className='w-full h-full' />
                {
                    isDragActive ?
                        <p className="text-red-500">Thả video tại đây.</p> :
                        <div className="flex gap-1"><p className="max-lg:hidden">Kéo thả hoặc</p>bấm để chọn file video</div>
                }
            </div>


            <button onClick={handleFinish}>upload</button>
        </div>
    );
}
