import ResultPage from "@/indirect/result/Result";
import { authOptions } from "@/lib/auth";
import { baseURL } from "@/lib/functional";
import { ChannelDataType, MediaDataType } from "@/types/type";
import { ResolvingMetadata, Metadata } from "next";
import { getServerSession } from "next-auth";
type Props = {
    params: { value: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const value = params.value;

    return {
        title: `kết quả tìm kiếm cho ${value}`,
        description: `các kết quả tìm kiếm cho ${value}`,
    };
}

const prefetch = async ({ value }: { value: string }) => {
    const data = await fetch(`${baseURL}/api/search?keyword=${value}`, {
        cache: "no-cache",
    });
    return await data.json();
};

export default async function Page({ params, searchParams }: Props) {
    const data: {
        channels: ChannelDataType[];
        videos: MediaDataType[];
    } = await prefetch({ value: params.value });
    const session = await getServerSession(authOptions);
    return <ResultPage data={data} session={session}/>;
}
