'use client'
import React, { useCallback, useState } from 'react'
import { useDropzone, Accept } from 'react-dropzone'
import Image from 'next/image'

export default function ScrollableDivs() {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setImg(URL.createObjectURL(acceptedFiles[0]))
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        maxFiles: 1,
        multiple: false
    })

    const [img, setImg] = useState<any>()

    return (
        <div className='w-screen h-screen flex flex-col items-center justify-center'>
            <div {...getRootProps()} className='h-12 border-2 border-black flex items-center'>
                <input {...getInputProps()} className='w-full h-full'/>
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag 'n' drop some files here, or click to select files</p>
                }
            </div>
            <Image src={img ? img : ''} alt='' width={160} height={90} />
        </div>
    );
}
