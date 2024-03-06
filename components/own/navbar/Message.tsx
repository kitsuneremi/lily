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
import { chatSocketURL } from "@/lib/functional";
import io from "socket.io-client";
import { MoreOutlined } from "@ant-design/icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AiOutlineMore, AiOutlineSearch } from 'react-icons/ai'
import { useDropzone } from "react-dropzone";
import { MdOutlineAttachFile } from "react-icons/md";
import { RiSendPlaneFill } from "react-icons/ri";

type Message = {
    accountId: number,
    memberId: number,
    file: File | undefined,
    content: string | File;
    roomId: number;
};
type Member = {
    memberId: number,
    accountId: number,
    accountName: string,
    nickname: string | undefined,
    deletedAt: Date | null
}

type Room = {
    id: number,
    name: string,
    avatar: string,
    member: Member[]
}

const socket = io(chatSocketURL).connect();

export default function MessageBox() {

    const { data: session } = useSession();

    const messageBoxButtonRef = useRef<HTMLDivElement>(null);
    const messageBoxMenuRef = useRef<HTMLDivElement>(null);
    const targetuserMessageMenuRef = useRef<HTMLDivElement>(null);
    const targetuserMessageButtonRef = useRef<HTMLDivElement>(null);
    const messageRenderRef = useRef<HTMLDivElement>(null);

    const [showMessageBox, setShowMessageBox] = useState<{ button: boolean, menu: boolean }>({ button: false, menu: false })
    const [availableRoom, setAvailableRoom] = useState<Room[]>([]);
    const [listUser, setListUser] = useState<any[]>([]);
    const [listMessage, setListMessage] = useState<any[]>([]);
    const [targetUser, setTargetUser] = useState<any>(null);
    const [targetRoom, setTargetRoom] = useState<Room>();
    const [messageContent, setMessageContent] = useState<string>('')
    const [currentMemberState, setCurrentMemberState] = useState<Member>()
    const [sendFile, setSendFile] = useState<File | undefined>()
    const [targetUserMessageMenuOpen, setTargetUserMessageMenuOpen] = useState<{ menu: boolean, button: boolean }>({ menu: false, button: false });
    const [searchRoomFocus, setSearchRoomFocus] = useState<boolean>(false);
    const [searchRoomValue, setSearchRoomValue] = useState<string>('');

    useOnClickOutside(targetuserMessageButtonRef, () => { setTargetUserMessageMenuOpen(prev => { return { menu: prev.menu, button: false } }) })
    useOnClickOutside(targetuserMessageMenuRef, () => { setTargetUserMessageMenuOpen(prev => { return { menu: false, button: prev.button } }) })

    useEffect(() => {
        if (session && targetRoom) {
            socket.removeAllListeners()
            socket.emit("join", {
                id: session.user.id,
                room: targetRoom.id,
            });
        }
    }, [session, targetRoom]);

    useEffect(() => {
        if (session && session.user && session.user.id) {
            axios.get(`/api/room?id=${session.user.id}`).then(res => {
                setAvailableRoom(res.data)
            })
        }
    }, [session])

    useEffect(() => {
        if (targetRoom) {
            axios.get(`/api/message?room=${targetRoom.id}`).then(res => {
                setListMessage(res.data)
            })
        }
    }, [targetRoom])

    useEffect(() => {
        if (session && session.user) {
            if (targetRoom) {
                setCurrentMemberState(targetRoom.member.find(value => value.accountId === session.user.id))
            }
        }
    }, [session, targetRoom])

    useEffect(() => {
        const handleReceivedMessage = (data: Message) => {
            setListMessage((prev) => [...prev, data]);
        };

        socket.on("rcvmsg", handleReceivedMessage);

        return () => {
            socket.off("rcvmsg", handleReceivedMessage);
        };
    }, [targetRoom])

    // useEffect(() => {
    //     if (session && session.user) {
    //         if (targetUser) {
    //             axios.post('/api/room', {
    //             }).then(res => {
    //                 setTargetRoom(res.data)
    //             })

    //             axios.get(`/api/messages?from=${session.user.id}&to=${targetUser.id}`).then(res => {
    //                 setListMessage(res.data)
    //             })
    //         }
    //     }
    // }, [targetUser, session])

    useOnClickOutside(messageBoxButtonRef, () => { setShowMessageBox(prev => { return { button: false, menu: prev.menu } }) })
    useOnClickOutside(messageBoxMenuRef, () => { setShowMessageBox(prev => { return { button: prev.button, menu: false } }) })

    const { getRootProps, getInputProps, open: setOpenUploadFile, isDragActive } = useDropzone({ noClick: true });

    const handleSendMessage = () => {
        if (session && session.user) {
            if (targetRoom && currentMemberState) {
                const data: Message = {
                    accountId: session.user.id,
                    content: messageContent,
                    roomId: targetRoom.id,
                    memberId: currentMemberState?.memberId,
                    file: sendFile
                }
                socket.emit("sendmsg", data)
                axios.post(`/api/messages?room=${targetRoom.id}&content=${messageContent}${session.user.id}`)
            }
        }
    }

    return (
        <div className="relative flex items-center">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <div className="text-2xl lg:text-3xl cursor-pointer" ref={messageBoxButtonRef} onClick={() => { setShowMessageBox(prev => { return { button: !prev.button, menu: false } }) }}>
                            <BsChatLeftDots />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Trò chuyện (đang phát triển)</p>
                        <p>cái này mới dỡ database nên phải làm lại :v</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {
                (showMessageBox.button || showMessageBox.menu) &&
                <div ref={messageBoxMenuRef} onMouseDown={() => { setShowMessageBox({ button: false, menu: true }) }} className="absolute p-2 z-[1000] bg-slate-50 dark:bg-slate-700 flex flex-col top-12 right-0 w-64 h-fit max-h-96">
                    {targetRoom
                        ?
                        <div className="flex flex-col flex-grow h-full">
                            <div className="w-full h-20 flex justify-between px-[3%] border-b-[1px] bg-slate-50 shadow-sm">
                                <div className="flex gap-2 items-center">
                                    <div onClick={() => { setTargetRoom(undefined) }}>back</div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 aspect-square relative">
                                            <Image alt="" src={targetRoom.avatar} fill sizes="1/1" className="rounded-full" />
                                            {/* <span className="bg-cyan-600 w-2 h-2 absolute bottom-1 right-1 rounded-full border-[1px] border-solid border-slate-800"></span> */}
                                            <div className="absolute w-4 h-4 bg-green-500 rounded-full bottom-1 right-1 border-[1px] border-white" />
                                        </div>
                                        <p className="text-xl">{targetRoom.name}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div className="text-2xl"><AiOutlineSearch /></div>
                                    <div className="text-2xl relative">
                                        <div ref={targetuserMessageButtonRef} onClick={() => { setTargetUserMessageMenuOpen({ button: true, menu: false }) }}>
                                            <AiOutlineMore />
                                        </div>
                                        {
                                            (targetUserMessageMenuOpen.button || targetUserMessageMenuOpen.menu)
                                            &&
                                            <div onMouseDown={() => setTargetUserMessageMenuOpen({ button: false, menu: true })} className="absolute flex flex-col gap-1 rounded-lg top-12 right-0 w-fit h-fit px-2 py-3 z-50 bg-slate-50 shadow-2xl" ref={targetuserMessageMenuRef}>
                                                <div className="min-w-36 px-3 py-1 rounded-md flex items-center text-red-600 font-bold text-sm hover:bg-slate-200">
                                                    Block
                                                </div>
                                                <div className="min-w-36 px-3 py-1 rounded-md flex items-center text-red-600 font-bold text-sm hover:bg-slate-200">
                                                    Block
                                                </div>
                                                <div className="min-w-36 px-3 py-1 rounded-md flex items-center text-red-600 font-bold text-sm hover:bg-slate-200">
                                                    Block
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            {/* message render */}
                            <div className="w-full h-[calc(100%-80px-56px)] overflow-y-scroll gap-5 tiny-scrollbar relative" ref={messageRenderRef}>
                                <div className={`absolute w-full h-full px-[2%] ${isDragActive ? '' : 'bg-white'}`}>
                                    {/* {
                                        targetMessageUserData &&
                                        messageListData.map((message, index) => {
                                            return (
                                                <div key={index} className="flex flex-col items-center h-max min-h-16">
                                                    <div className={`p-2 rounded-full items-center w-fit max-w-[66%] flex gap-2 ${message.idSend == users.id ? 'flex-row-reverse self-end' : 'flex-row'} mt-2`}>
                                                        <img className="w-16 h-16 rounded-full" src={`${message.idSend == users.id ? users.Avarta : targetMessageUserData.img}`} alt='' />
                                                        <div className="bg-white text-black p-3 min-h-[50px] rounded-3xl ml-2">
                                                            <div className="flex flex-col gap-1">
                                                                <p className={`font-bold text-xl ${message.idSend == users.id ? 'self-end' : 'self-start'}`} id={index}>
                                                                    {message.content}
                                                                </p>
                                                                <p className={`text-xs font-thin text-slate-500 ${message.idSend == users.id ? 'self-end' : 'self-start'}`}>{message.sendAt}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    } */}
                                </div>
                                <div className={`sticky top-0 left-0 w-full h-full px-[1.5%]`} {...getRootProps()}>
                                    {
                                        isDragActive ? (
                                            <div className="h-full w-full bg-slate-200 border-2 border-dashed border-cyan-400 bg-opacity-30 flex items-center text-center justify-center">
                                                <input
                                                    {...getInputProps()}
                                                    aria-label="file"
                                                    className="w-full h-full"
                                                />
                                                <p className="text-2xl font-bold">
                                                    Drop file here
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex gap-1">
                                                {sendFile ? sendFile.name : ''}
                                            </div>
                                        )}
                                </div>
                            </div>
                            <div className="w-full h-max flex justify-between px-[3%] border-t-[1px] shadow-sm bg-slate-50 dark:bg-slate-800">
                                <div className="h-full flex items-center">
                                    <button onClick={setOpenUploadFile}>
                                        <MdOutlineAttachFile />
                                    </button>
                                </div>
                                <div className="flex flex-row-reverse px-5 gap-3 flex-grow items-center">
                                    <button className="w-9 aspect-square" onClick={handleSendMessage}>
                                        <RiSendPlaneFill />
                                    </button>
                                    <div className="flex-grow flex flex-col gap-1 rounded-full border-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1">
                                        {sendFile ? <p>{sendFile.name}</p> : <></>}
                                        <input className="" placeholder="enter message" />
                                    </div>

                                </div>
                            </div>
                        </div>
                        :
                        <div className="flex flex-col gap-4">
                            {/* <div className="w-full h-9 rounded-xl relative">
                                <input value={searchRoomValue} onChange={e => setSearchRoomValue(e.target.value)} className="px-2 py-1 text-xl rounded-xl bg-slate-200 dark:bg-slate-700" placeholder="tìm kiếm" onFocus={() => setSearchRoomFocus(true)} onBlur={() => setSearchRoomFocus(false)} />
                                {
                                    (searchRoomFocus && searchRoomValue.trim().length != 0)
                                    &&
                                    <div className="absolute w-full h-fit top-7 right-0">

                                    </div>
                                }
                            </div> */}
                            <div className="">
                                {availableRoom.map((room, index) => {
                                    return (
                                        <div key={index} className="flex gap-2" onClick={() => { setTargetRoom(room) }}>
                                            <div className="relative w-8 h-8">
                                                <Image alt="" src={room.avatar} fill sizes="1/1" className="rounded-full" />
                                                {/* <span className="bg-cyan-600 w-2 h-2 absolute bottom-1 right-1 rounded-full border-[1px] border-solid border-slate-800"></span> */}
                                            </div>
                                            <div className="flex-grow flex flex-row-reverse gap-2">
                                                <div className="flex items-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger>
                                                            <div className="text-2xl"><MoreOutlined /></div>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem>menu này đang phát triển</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>

                                                </div>
                                                <div className="flex-grow">
                                                    <p className="text-xl font-bold">{room.name}</p>
                                                    <p>last message</p>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                })}
                                {
                                    availableRoom.length == 0
                                    &&
                                    <div className="w-full h-14 flex items-center justify-center">
                                        <p>chưa có cuộc trò chuyện nào</p>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </div>
            }
        </div >
    )
}

