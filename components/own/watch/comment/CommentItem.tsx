"use client";
import { CommentDataType } from "@/types/type";
import { FormatDateTime, baseURL } from "@/lib/functional";
import { useEffect, useState } from "react";
import {
    AiOutlineDown,
    AiFillLike,
    AiOutlineLike,
    AiFillDislike,
    AiOutlineDislike,
} from "react-icons/ai";
import axios from "axios";
import Image from "next/image";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffectOnce } from "usehooks-ts";

type AccountDataType = {
    id: number;
    email: string;
    name: string;
    username: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export default function CommentItem({ cmt }: { cmt: CommentDataType }) {
    const [like, setLike] = useState<boolean>(false);
    const [dislike, setDislike] = useState<boolean>(false);
    const [accountData, setAccountData] = useState<AccountDataType>();
    useEffectOnce(() => {
        axios
            .get("/api/account/data", {
                params: {
                    id: cmt.accountId,
                },
            })
            .then((res) => {
                setAccountData(res.data);
            });
    });

    const ImageRender = () => {
        if (cmt.accountImage) {
            return (
                <Image src={cmt.accountImage} fill alt="" className="rounded-full" />
            );
        } else {
            return (
                <Image
                    src={
                        "https://danviet.mediacdn.vn/upload/2-2019/images/2019-04-02/Vi-sao-Kha-Banh-tro-thanh-hien-tuong-dinh-dam-tren-mang-xa-hoi-khabanh-1554192528-width660height597.jpg"
                    }
                    fill
                    alt=""
                    className="rounded-full animate-spin"
                />
            );
        }
    };

    return (
        <div className="flex gap-3">
            <div className="w-[45px] h-full max-sm:w-8">
                <div className="relative w-full h-[45px] max-sm:h-8">
                    <ImageRender />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <div className="flex gap-3">
                    <p>@{accountData?.name}</p>
                    <p>{FormatDateTime(cmt.createdAt)}</p>
                </div>

                <div>
                    <p>{cmt.content}</p>
                </div>
                <div className="flex gap-1">
                    {like ? <AiFillLike /> : <AiOutlineLike />}
                    {dislike ? <AiFillDislike /> : <AiOutlineDislike />}
                    <button>Phản hồi</button>
                </div>
            </div>
        </div>
    );
}
