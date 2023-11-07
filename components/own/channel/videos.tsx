"use client";
import { useEffect, useState } from "react";
import { ChannelDataType, MediaDataType } from "@/types/type";
import { FaPlay } from "react-icons/fa";
import Image from "next/image";
import { FormatDateTime } from "@/lib/functional";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import axios from "axios";
import { redirect } from "next/navigation";
import { useEffectOnce } from "usehooks-ts";
export default function Videos({
    channelData,
}: {
    channelData: ChannelDataType;
}) {
    const [listVideoData, setListVideoData] = useState<MediaDataType[]>([]);

    useEffectOnce(() => {
        axios
            .get("/api/video/channel/all", {
                params: {
                    channelId: channelData.id,
                },
            })
            .then((res) => {
                setListVideoData(res.data);
            });
    });

    return (
        <>
            <div className="hidden-scrollbar w-full grid grid-cols-5 grid-flow-col-dense h-max gap-3">
                {listVideoData.map((video, index) => {
                    return <VideoItem videoData={video} key={index} />;
                })}
            </div>
        </>
    );
}

const VideoItem = ({ videoData }: { videoData: MediaDataType }) => {
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
                <p>{FormatDateTime(videoData.createdTime)}</p>
            </div>
        </div>
    );
};
