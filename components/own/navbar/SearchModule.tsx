import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
const SearchModule = () => {
    const router = useRouter();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchResultRef = useRef<HTMLDivElement>(null);
    const [searchValue, setSearchValue] = useState<string>("");
    const [focusing, setFocus] = useState<boolean>(false);
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
                        className="absolute w-80 h-fit left-[-16px] items-center top-12 max-w-[95vw] bg-white dark:bg-slate-600 border-[1px] border-slate-400 rounded-lg"
                        ref={searchResultRef}
                    >
                        <div className="flex px-4 py-1 gap-9 h-max items-center">
                            <div className="flex items-center">
                                <AiOutlineSearch />
                            </div>
                            <div className="flex items-center flex-1 h-fit">
                                <p className="w-full text-lg whitespace-nowrap text-ellipsis h-max overflow-hidden">
                                    {searchValue}
                                </p>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    );
};

export default SearchModule;