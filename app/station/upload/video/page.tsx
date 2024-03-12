"use client";
import NextImage from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { PinturaEditorModal } from "@pqina/react-pintura";
import { AiOutlineCopy } from "react-icons/ai";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { useCopyToClipboard } from "usehooks-ts";
import { fileURL } from "@/lib/functional";
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { Account } from "@/prisma/type";

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



function makeid() {
    let length = 8;
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
    }
    return result;
}

const getFileExt = (file: File) => {
    return file.name.substring(file.name.lastIndexOf(".") + 1);
};

export default function Page() {
    const [value, copy] = useCopyToClipboard();

    const [name, setName] = useState<string>("");
    const [des, setDes] = useState<string>("");
    const [link, setLink] = useState<string>("");
    const PinturaRef = useRef<PinturaEditorModal>(null);

    const [step, setStep] = useState<number>(0);
    const [visible, setVisible] = useState<boolean>(false);
    const [channelData, setChannelData] = useState<Account>();

    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [originalThumbnail, setOriginalThumbnail] = useState<{
        file: File;
        width: number;
        height: number;
    } | null>(
        null
    );
    const [accept, setAccept] = useState<boolean>(false);

    const [previewVideo, setPreviewVideo] = useState<string>("");

    const { toast } = useToast();

    const { data: session } = useSession();

    useEffect(() => {
        setLink(makeid());
    }, []);

    useEffect(() => {
        if (session) {
            axios
                .get(`/api/channel/data?accountId=${session.user.id}`)
                .then((res) => {
                    setChannelData(res.data);
                });
        }
    }, [session]);

    const onVideoDrop = useCallback((acceptedFiles: File[]) => {
        setVideoFile(acceptedFiles[0]);
        // chấp nhận file dưới 5Gb
        if (acceptedFiles[0] && acceptedFiles[0].size < 5368709120) {
            setPreviewVideo(URL.createObjectURL(acceptedFiles[0]));
        }
    }, []);

    const onThumbnailDrop = useCallback((acceptedFiles: File[]) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const image = new Image();
            //@ts-ignore
            image.src = event.target!.result;

            image.onload = () => {
                if (image.width / image.height !== 16 / 9) {
                    handleEditImage({
                        file: acceptedFiles[0],
                    });
                } else {
                    setOriginalThumbnail({
                        file: acceptedFiles[0],
                        width: image.width,
                        height: image.height,
                    });
                }
            };
        };
        reader.readAsDataURL(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onVideoDrop,
        accept: {
            "video/*": [],
        },
        maxFiles: 1,
        multiple: false,
    });

    const {
        getRootProps: getThumbnailRootProps,
        getInputProps: getThumbnailInputProps,
        isDragActive: isThumbnailDragActive,
    } = useDropzone({
        onDrop: onThumbnailDrop,
        accept: {
            "image/*": [],
        },
        maxFiles: 1,
        multiple: false,
    });

    const handleEditImage = ({
        file,
    }: {
        file: File;
    }) => {
        setVisible(true);
        setTimeout(() => {
            if (PinturaRef && PinturaRef.current) {
                PinturaRef.current.editor
                    //@ts-ignore
                    .loadImage(file, { imageCropAspectRatio: 16 / 9 })
                    .then((imageReaderResult) => {
                        // Logs loaded image data
                        // console.log(imageReaderResult);
                    });
            }
        }, 1000);
    };

    const handleFinish = () => {
        if (session && session.user && channelData) {
            if (name.trim().length == 0) {
                toast({
                    title: "điền tiêu đề",
                });
            } else if (!videoFile) {
                toast({
                    title: "Chọn video",
                });
            } else if (!originalThumbnail) {
                toast({
                    title: "Chọn ảnh",
                });
            } else {
                const formData = new FormData();
                formData.append(
                    "video",
                    videoFile,
                    link + "." + getFileExt(videoFile)
                );
                formData.append("link", link);
                formData.append("title", name);
                formData.append("des", des);
                formData.append("channelId", channelData.id.toString());

                axios
                    .post(`${fileURL}/api/decay/video`, formData, {
                        headers: {
                            ContentType: "multipart/form-data",
                        },
                    })
                    .then((res) => {
                        if (res.data) {
                            toast({
                                title: res.data.title,
                                description: res.data.content,
                            });
                            const t = new FormData;
                            t.append('image', originalThumbnail.file);
                            axios.post(`${fileURL}/api/image/thumbnail?id=${res.data.id}`, t)
                        } else {
                            toast({
                                title: "Lỗi",
                                description:
                                    "Đã có lỗi xảy ra vui lòng thử lại sau",
                            });
                        }
                    });
            }
        }
    };

    const returnProgress = () => {
        if (step == 0) {
            return 0;
        } else if (step == 1) {
            return 33;
        } else if (step == 2) {
            return 66;
        } else {
            return 100;
        }
    }

    const StepRender = () => {
        if (step == 0) {
            return (
                <div className="flex flex-col text-start gap-6">
                    <div className="text-2xl">Lựa chọn video</div>
                    <div className="flex justify-center items-center">
                        <div
                            {...getRootProps()}
                            className="h-72 w-full border-[1px] border-cyan-900 border-dashed flex items-center text-center justify-center"
                        >
                            <input
                                {...getInputProps()}
                                aria-label="video"
                                className="w-full h-full"
                            />
                            {isDragActive ? (
                                <p className="text-red-500">
                                    Thả video tại đây.
                                </p>
                            ) : (
                                <div className="flex gap-1">
                                    {videoFile ? <p>{videoFile.name}</p> : <>
                                        <p className="max-lg:hidden">
                                            Kéo thả hoặc
                                        </p>
                                        bấm để chọn file video
                                    </>
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                    <p>kích cỡ tối đa cho phép là 5Gb</p>

                    <div className="flex justify-end">
                        <button className={`rounded-lg ${videoFile ? 'bg-cyan-200 text-slate-800' : 'bg-slate-500'}  px-3 py-2`} onClick={() => { videoFile ? setStep(1) : () => { } }}>tiếp tục</button>
                    </div>
                </div>
            )
        } else {
            return (
                <>
                    <div className="flex max-lg:flex-col">
                        {
                            step == 1 ? <div className="px-3 w-full lg:w-1/2">
                                <div className="flex flex-col gap-3">
                                    <p className="text-3xl font-semibold mb-3">
                                        Điền thông tin
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <label className="w-full flex gap-2 whitespace-nowrap">
                                            Tiêu đề (bẳt buộc)
                                            <input
                                                className="relative flex-1 w-32 border-b-2 bg-transparent border-slate-600 focus:border-slate-800 outline-none"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </label>
                                    </div>
                                    <label className="flex flex-col gap-2">
                                        mô tả
                                        <textarea
                                            className="w-full border-[1px] bg-transparent border-slate-600 rounded-sm p-1 h-fit"
                                            value={des}
                                            onChange={(e) => setDes(e.target.value)}
                                        />
                                    </label>

                                    <div className="flex flex-col gap-3">
                                        <p>Hình thu nhỏ</p>
                                        <p className="text-xs">Chọn hoặc tải một hình ảnh lên để thể hiện nội dung trong video của bạn. Hình thu nhỏ hấp dẫn sẽ làm nổi bật video của bạn và thu hút người xem.</p>
                                        <div className="flex gap-3">
                                            <div
                                                {...getThumbnailRootProps()}
                                                className="w-[240px] h-[135px] border-[1px] border-cyan-900 border-dashed flex items-center text-center justify-center"
                                            >
                                                <input
                                                    {...getThumbnailInputProps()}
                                                    className="w-full h-full"
                                                />
                                                {isThumbnailDragActive ? (
                                                    <p className="text-red-500">Thả ảnh tại đây.</p>
                                                ) : (
                                                    <div className="flex gap-1">
                                                        {originalThumbnail ? (
                                                            <p>{originalThumbnail.file.name}</p>
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

                                            <div className="w-[240px] h-[135px] relative"><Skeleton className="w-full h-full absolute top-0 left-0" /></div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                                :
                                <div className="flex flex-col gap-10 px-8 w-full lg:w-1/2">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-lg">Chế độ hiển thị</p>
                                        <div>
                                            <p>Đặt video của bạn ở chế độ công khai, không công khai hoặc riêng tư</p>
                                            <Select>
                                                <SelectTrigger id="videoMode" className="lg:w-3/5">
                                                    <SelectValue placeholder="Lưu hoặc xuất bản" />
                                                </SelectTrigger>
                                                <SelectContent position="popper">
                                                    <SelectItem value="0">Công khai</SelectItem>
                                                    <SelectItem value="1">Không công khai</SelectItem>
                                                    <SelectItem value="2">Riêng tư</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>


                                    <div className="flex flex-col justify-center gap-3 w-full">
                                        <div className="items-top flex space-x-2">
                                            <input
                                                type="checkbox"
                                                id="terms1"
                                                checked={accept}
                                                onChange={(e) => setAccept(e.target.checked)}
                                            />
                                            <div className="grid gap-1.5 leading-none h-fit">
                                                <label
                                                    htmlFor="terms1"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    Accept terms and conditions
                                                </label>
                                                <p className="text-sm text-muted-foreground font-bold">
                                                    You agree to our{" "}
                                                    <Link
                                                        className="underline text-red-500"
                                                        href={"/Term"}
                                                    >
                                                        Terms of Service and Privacy Policy.
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                className={`${accept
                                                    ? "bg-gradient-to-r from bg-cyan-200 to-cyan-600 text-black"
                                                    : "bg-red-500 text-yellow-50 border-[1px] "
                                                    } font-bold text-xl w-full h-10`}
                                                disabled={!accept}
                                                onClick={handleFinish}
                                            >
                                                {accept
                                                    ? "Hoàn thành"
                                                    : "Đồng ý với điều khoản!"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                        }
                        <div className="flex flex-col">
                            <p className="text-3xl font-semibold">Xem trước video</p>
                            <div className="bg-[#1f1f1f] flex flex-col gap-3 rounded-lg pb-3">
                                <div className="">
                                    <video
                                        src={previewVideo}
                                        controls
                                        className="lg:w-[45vw] h-fit rounded-lg"
                                    ></video>
                                </div>
                                <div className="px-5">
                                    <label className="w-full flex flex-col gap-2">
                                        Đường liên kết của video
                                        <div className="flex gap-2">
                                            <Link href={`https://erinasaiyukii.com/watch/${link}`}>
                                                <p className="relative flex-1 w-full text-cyan-300">erinasaiyukii.com/watch/{link}</p></Link>
                                            <button
                                                onClick={() => {
                                                    copy(`erinasaiyukii.com/watch/${link}`);
                                                }}
                                                className="flex items-center justify-center w-7 h-7"
                                            >
                                                <AiOutlineCopy />
                                            </button>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-5">
                        <button className={`px-3 py-2 rounded-lg bg-slate-700 ${step == 1 ? 'hidden' : ''}`} onClick={() => { setStep(prev => { return prev - 1 }) }}>trở lại</button>
                        <button className={`rounded-lg ${step == 2 ? 'hidden' : ''} ${originalThumbnail ? 'bg-cyan-200 text-slate-800' : 'bg-slate-500'}  px-3 py-2`} onClick={() => { originalThumbnail ? setStep(prev => { return prev + 1 }) : () => { } }}>tiếp tục</button>
                    </div>
                </>
            )

        }
    }

    return (
        <div className="flex-1 flex-shrink-0 flex-col lg:flex-row px-12 h-full">
            <div className="mb-5">
                <Progress className="h-2" title="video upload progress" value={returnProgress()} />
                <div className="flex justify-between">
                    <p>đăng tải video</p>
                    <p>điền thông tin</p>
                    <p>cài đặt</p>
                    <p></p>
                </div>
            </div>
            {StepRender()}
            {visible && (
                <PinturaEditorModal
                    ref={PinturaRef}
                    {...editorDefaults}
                    onHide={() => setVisible(false)}
                    onProcess={(com) => {
                        setOriginalThumbnail({
                            file: com.dest,
                            //@ts-ignore
                            width: com.imageState.crop?.width,
                            //@ts-ignore
                            height: com.imageState.crop?.height,
                        })
                    }}
                />
            )}
        </div>
    );
}