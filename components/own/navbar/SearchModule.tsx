import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import Link from 'next/link'
import { useSession } from "next-auth/react";
import { useOnClickOutside } from "usehooks-ts";

// type SearchResult = {
//     keywordSearch: { title: string, link: string }[],
//     userHistory: { content: string }[]
// }

type SearchResult = {
    keywordSearch: any[],
    userHistory: any[]
}

const SearchModule = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchResultRef = useRef<HTMLDivElement>(null);
    const [searchValue, setSearchValue] = useState<string>("");
    const [focusing, setFocus] = useState<{ input: boolean, menu: boolean }>({ input: false, menu: false });
    const [searchResult, setSearchResult] = useState<SearchResult>({ keywordSearch: [], userHistory: [] });

    useEffect(() => {
        if (searchValue.trim().length > 0) {
            const fetchData = async () => {
                const searchKeyword = axios.get(`/api/quicksearch?keyword=${searchValue}`)
                if (session?.user) {
                    const searchHistoryPromise = axios.get(`/api/searchhistory?keyword=${searchValue}&userId=${session.user.id}}`)
                    const [userHistoryData, KeywordSearchData] = await Promise.all([searchHistoryPromise, searchKeyword])
                    setSearchResult({ userHistory: userHistoryData.data, keywordSearch: KeywordSearchData.data })
                } else {
                    searchKeyword.then(res => { setSearchResult({ keywordSearch: res.data, userHistory: [] }) })
                }

            }
            fetchData();
        } else {
            setFocus({ input: false, menu: false })
        }
    }, [searchValue])

    useOnClickOutside(searchResultRef, () => {
        setFocus(prev => { return { ...prev, menu: false } })
    })

    

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
                            setFocus({ input: true, menu: false });
                        }}
                        onBlur={() => setFocus(prev => { return { ...prev, input: false } })}
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

                {/* serch result render */}
                {(focusing.input || focusing.menu) &&
                    <div
                        className="absolute w-80 h-fit left-[-16px] items-center top-12 max-w-[95vw] bg-slate-50 dark:bg-slate-600 border-[1px] border-slate-100 rounded-lg shadow-lg"
                        ref={searchResultRef}
                        onMouseDown={() => { setFocus({ input: false, menu: true })}}
                    >
                        <div className="flex flex-col flex-1 h-fit p-3">
                            {searchResult.userHistory.map((item, index) => {
                                return (
                                    <Link href={`/search?keyword=${item.content}`} key={index}>
                                        <div className="w-full flex gap-2 px-2 py-1 items-center rounded-md m-1 hover:scale-105 hover:bg-slate-200 hover:shadow-lg hover:text[18px] hover:text-purple-950 dark:hover:text-purple-400">
                                            <AiOutlineSearch />
                                            <p className="w-full text-lg whitespace-nowrap text-ellipsis h-max overflow-hidden">
                                                {item.content}
                                            </p>
                                        </div>
                                    </Link>
                                )
                            })}
                            {searchResult.keywordSearch.map((item, index) => {
                                return (
                                    <Link href={`/watch/${item.link}`} key={index}>
                                        <div className="w-full flex gap-2 px-2 py-1 items-center rounded-md m-1 hover:scale-105 hover:bg-slate-200 hover:shadow-lg hover:text[18px] hover:text-purple-950 dark:hover:text-purple-400">
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