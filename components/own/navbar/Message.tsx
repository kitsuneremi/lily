import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { BsChatLeftDots } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function MessageBox() {

    const { data: session } = useSession();

    const messageBoxButtonRef = useRef<HTMLDivElement>(null);
    const messageBoxMenuRef = useRef<HTMLDivElement>(null);

    const [showMessageBox, setShowMessageBox] = useState<{ click: boolean, menuFocus: boolean }>({ click: false, menuFocus: false })
    const [availableRoom, setAvailableRoom] = useState<any[]>([]);
    const [listUser, setListUser] = useState<any[]>([]);
    const [listMessage, setListMessage] = useState<any[]>([]);
    const [targetUser, setTargetUser] = useState<any>(null);
    const [targetRoom, setTargetRoom] = useState<any>(null);
    const [messageContent, setMessageContent] = useState<any>('')

    useEffect(() => {
        if (session && session.user) {
            axios.get(`/api/room?id=${session.user.id}`).then(res => {
                setAvailableRoom(res.data)
            })
        }
    }, [])

    useEffect(() => {
        if (session && session.user) {
            if (targetUser) {
                axios.post('/api/room', {
                }).then(res => {
                    setTargetRoom(res.data)
                })


                // axios.get(`/api/messages?from=${session.user.id}&to=${targetUser.id}`).then(res => {
                //     setListMessage(res.data)
                // })
            }
        }
    }, [targetUser])

    useOnClickOutside(messageBoxButtonRef, () => { setShowMessageBox(prev => { return { click: !prev.click, menuFocus: prev.menuFocus } }) })
    useOnClickOutside(messageBoxMenuRef, () => { setShowMessageBox(prev => { return { click: prev.click, menuFocus: !prev.menuFocus } }) })


    const handleSendMessage = () => {
        if (session && session.user) {
            axios.post(`/api/messages?room=${targetRoom.id}&content=${messageContent}${session.user.id}`).then(res => {
                setListMessage(res.data)
            })
        }

    }

    return (
        <div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <div className="text-2xl cursor-pointer" onClick={() => { setShowMessageBox(prev => { return { click: !prev.click, menuFocus: false } }) }}>
                            <BsChatLeftDots />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Trò chuyện</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {
                showMessageBox &&
                <div ref={messageBoxMenuRef} onMouseDown={() => { setShowMessageBox({ click: false, menuFocus: true }) }} className="absolute flex flex-col top-20 w-96 h-40">
                    {
                        targetUser ?
                            <div className="flex flex-col gap-2">
                                {
                                    listMessage.map((message, index) => {
                                        return (
                                            <div key={index} className="flex gap-2">
                                                <div className={`flex gap-2 ${message.id == session?.user.id ? 'flex-row-reverse' : 'flex-row'} items-center`}>
                                                    <div className="relative w-6 aspect-square">
                                                        {/* @ts-ignore */}
                                                        <Image src={session ? session.user.avatarImage : ''} alt="" fill className="rounded-full" />
                                                    </div>
                                                    <div className="flex flex-row gap-1">
                                                        {
                                                            message.id != session?.user.id &&
                                                            <p className="font-semibold text-lg">target nick name</p>
                                                        }
                                                        {/* message content */}
                                                        <div className="p-2 bg-slate-300 dark:bg-slate-800 h-fit max-w-[66%]">
                                                            <p className="text-slate-800 dark:text-slate-300">message content</p>
                                                        </div>
                                                        <p className="text-xs text-slate-100 dark:text-slate-700">send at ???</p>

                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            :
                            <div className="flex flex-col gap-2">
                                {listUser.map((user, index) => {
                                    return (
                                        <div key={index} className="flex gap-2" onClick={() => { setTargetUser(user.id) }}>
                                            <div className="relative w-6 aspect-square">
                                                <Image src={''} alt="" fill className="rounded-full" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <p className="font-bold text-xl">user name</p>
                                                <p></p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                    }
                </div>
            }
        </div >
    )
}