import ResultPage from "@/indirect/result/Result";
import { baseURL } from "@/lib/functional";
import { ResolvingMetadata, Metadata } from "next";
import { auth } from '@/auth'
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
    const data = await prefetch({ value: params.value });
    const session = await auth();
    return <ResultPage data={data} session={session} />;
}
