'use server'
import { authOptions } from "@/lib/auth";
import { baseURL } from "@/lib/functional";
import { ChannelDataType, MediaDataType } from "@/types/type";
import { ResolvingMetadata, Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from 'next/dynamic'
import { Suspense } from "react";

const DirectPageProfile = dynamic(() => import('@/indirect/profile/profile'), { ssr: true })

type Props = {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const value = params.id;


    return {
        title: `trang cá nhân của ${value}`,
        description: `trang cá nhân của ${value}`,
    };
}

const prefetch = async ({ value }: { value: string | number }) => {
    const data = await fetch(`${baseURL}/api/profile?id=${value}`, {
        cache: "no-cache",
    });
    return await data.json();
};

export default async function Profile({ params, searchParams }: Props) {

    const prefetchData = await prefetch({ value: params.id });

    return (
        <Suspense fallback={<>loading</>}>
            <DirectPageProfile profileData={prefetchData} />
        </Suspense>
    )
}