import { useState } from "react";
import Image from "next/image";
import Link from 'next/link'
import { ReduceString } from "@/lib/functional";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/storage";
import { close, reverse, open } from "@/redux/features/sidebar-slice";

type subcribe = {
    name: string;
    tagName: string;
    image: string;
};

const SubcribedChannel = ({ item }: { item: subcribe }) => {
    const openSidebar = useAppSelector(
        (state) => state.sidebarReducer.value.sidebar
    );
    return (
        <Link href={`/channel/${item.tagName}`}>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600 px-2 py-1 rounded-lg">
                <div className="flex flex-col justify-center">
                    <div className="flex items-center w-4 h-4 relative">
                        <Image
                            fill
                            sizes={"1/1"}
                            src={item.image}
                            alt={item.name}
                            className="rounded-full"
                        />
                    </div>
                </div>
                <div
                    className={`flex justify-center items-center ${openSidebar ? "" : "hidden"
                        }`}
                >
                    <p className="">
                        {ReduceString({ maxLength: 16, string: item.name })}
                    </p>
                </div>
            </div>
        </Link>
    );
};

const SubcribeRender = ({ subcribedList }: { subcribedList: subcribe[] }) => {

    const [showFullSubcribe, setShowFullSubcribe] = useState<boolean>(false);

    if (subcribedList) {
        return (
            <>
                <div className="w-full my-2 h-[2px] relative after:absolute after:bg-slate-300 dark:after:bg-slate-500 after:h-[90%] after:top-[5%] after:left-0 after:w-full" />
                <p className="w-full text-lg pl-2">Kênh đăng ký</p>
                {/* kênh đăng ký */}
                <div className="">
                    {subcribedList.length > 5 && (
                        <div
                            className="w-full"
                            onClick={() => {
                                setShowFullSubcribe((prev) => {
                                    return !prev;
                                });
                            }}
                        >
                            {showFullSubcribe
                                ? "Ẩn bớt"
                                : `Hiển thị ${subcribedList.length - 5} kênh nữa`}
                        </div>
                    )}
                    {showFullSubcribe
                        ? subcribedList.map((item, index) => {
                            return (
                                <SubcribedChannel
                                    item={item}
                                    key={index}
                                />
                            );
                        })
                        : subcribedList.slice(0, 5).map((item, index) => {
                            return (
                                <SubcribedChannel
                                    item={item}
                                    key={index}
                                />
                            );
                        })}
                </div>
            </>
        );
    }
};

export default SubcribeRender