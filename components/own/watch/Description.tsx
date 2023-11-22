import { FormatDateTime } from "@/lib/functional"
export default function Description({ view, createdTime, des, mediaType, fullscreen }: { view: number, mediaType: number, createdTime: Date, des: string, fullscreen: boolean}) {
    return (
        <div
            className={`rounded-xl p-3 my-4 flex flex-col gap-2 bg-slate-200 dark:bg-slate-900 ${fullscreen ? "px-3" : ""
                }`}
        >
            <div className="flex gap-3">
                <p>{view} lượt xem</p>
                <p>
                    {mediaType == 0
                        ? FormatDateTime(
                            createdTime
                        )
                        : `Đã phát trực tiếp ${FormatDateTime(
                            createdTime
                        )}`}
                </p>
            </div>
            <p className="">{des}</p>
        </div>

    )
}