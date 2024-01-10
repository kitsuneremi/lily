import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import Link from 'next/link'
const SearchModule = () => {
    const router = useRouter();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchResultRef = useRef<HTMLDivElement>(null);
    const [searchValue, setSearchValue] = useState<string>("");
    const [focusing, setFocus] = useState<boolean>(false);
    const [searchResult, setSearchResult] = useState<any[]>([]);

    useEffect(() => {
        if (searchValue.trim().length > 0) {
            axios.get(`/api/quicksearch?keyword=${searchValue}`).then((res) => {
                console.log(res.data)
                setSearchResult(res.data)
            })
        }else{
            setFocus(false)
        }
    }, [searchValue])
    return (
        <>
            <div className="relative flex gap-1 items-center rounded-2xl border-[1px] border-[#ccccc] bg-slate-100 dark:bg-slate-800">
                <div className="w-max flex items-center h-full">
                    <input
                        className="bg-transparent pr-1 w-60 max-sm:w-40 focus:outline-none ml-3 my-1 text-base leading-6"
                        ref={searchInputRef}
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                        }}
                        onFocus={() => {
                            setFocus(true);
                        }}
                        onBlur={() => setFocus(false)}
                    />
                    <div className="w-[2px] h-full relative after:absolute after:bg-slate-300 dark:after:bg-slate-500 after:h-[90%] after:top-[5%] after:left-0 after:w-full" />
                    <div
                        className="h-full w-8 flex flex-col pl-2 justify-center cursor-pointer hover:bg-slate-400 dark:hover:bg-slate-700 text-[#020817] dark:text-[white] rounded-r-2xl"
                        onClick={() => {
                            router.push(`/result/${searchValue}`);
                        }}
                    >
                        <AiOutlineSearch />
                    </div>
                </div>

                {focusing &&
                    <div
                        className="absolute w-80 h-fit left-[-16px] items-center top-12 max-w-[95vw] bg-slate-50 dark:bg-slate-600 border-[1px] border-slate-100 rounded-lg shadow-lg"
                        ref={searchResultRef}
                    >
                        <div className="flex flex-col flex-1 h-fit p-3">
                            {searchResult.map((item, index) => {
                                return (
                                    <Link href={`/watch/${item.link}`} key={index}>
                                    <div className="w-full flex gap-2 px-2 py-1 items-center rounded-md m-1 hover:scale-105 hover:bg-slate-200 hover:shadow-lg">
                                        <AiOutlineSearch />
                                        <p className="w-full text-lg whitespace-nowrap text-ellipsis h-max overflow-hidden">
                                            {item.title}
                                        </p>
                                    </div>
                                    </Link>
                                )
                            })}

                        </div>
                    </div>
                }
            </div>
        </>
    );
};

export default SearchModule;