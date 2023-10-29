"use client";
import { ChannelDataType, VideoDataType } from "@/types/type";
import { FaPlay } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FormatDateTime } from "@/lib/functional";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import axios from "axios";
import { redirect } from "next/navigation";

export default function ChannelHome({
    channelData,
}: {
    channelData: ChannelDataType;
}) {
    const [listPo, setListPo] = useState<VideoDataType[]>([]);

    useEffect(() => {
        axios
            .get("/api/video/viewdesc", {
                params: {
                    channelId: channelData.id,
                },
            })
            .then((res) => {
                setListPo(res.data);
            });
    }, []);

    return (
        <div className="flex flex-col">
            <div className="flex flex-col gap-3">
                <div className="flex gap-5">
                    <p>Video phổ cmn biến</p>
                    <p className="flex gap-2 items-center">
                        <FaPlay /> Phát cmn hết
                    </p>
                </div>
                <div className="overflow-x-scroll hidden-scrollbar w-full grid grid-cols-5 grid-flow-col-dense h-max gap-3">
                    {listPo.map((video, index) => {
                        return <VideoItem videoData={video} key={index} />;
                    })}
                </div>
            </div>
        </div>
    );
}

const VideoItem = ({ videoData }: { videoData: VideoDataType }) => {
    const [img, setImg] = useState<string>("");
    const videoImageStorageRef = ref(
        storage,
        `/video/thumbnails/${videoData.link}`
    );
    useEffect(() => {
        getDownloadURL(videoImageStorageRef).then((url) => setImg(url));
    }, []);
    return (
        <div
            className="flex flex-col cursor-pointer"
            onClick={() => redirect(`/watch/${videoData.link}`)}
        >
            <div className="relative w-full pt-[56.25%]">
                <Image src={img} alt="" sizes="16/9" fill />
            </div>
            <p>{videoData.title}</p>
            <div className="flex justify-between">
                <p>{videoData.view} lượt xem</p>
                <p>{FormatDateTime(videoData.createdAt)}</p>
            </div>
        </div>
    );
};
