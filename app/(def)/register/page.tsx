'use client'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { signIn, useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import axios from 'axios'
import { redirect, useRouter } from "next/navigation"

export default function Page() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status == "authenticated") {
            redirect('/')
        }
    }, [status])

    const [mode, setMode] = useState<boolean>(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);


    const { toast } = useToast()

    const { theme } = useTheme()

    const handleRegister = async () => {
        if (mode) {
            if (usernameRef.current && usernameRef.current.value && passwordRef.current && passwordRef.current.value !== '' && passwordRef.current.value.length > 0 && confirmPasswordRef.current && confirmPasswordRef.current.value && confirmPasswordRef.current.value === passwordRef.current.value && emailRef.current && emailRef.current.value !== '') {
                await axios.post('/api/signup', {
                    username: usernameRef.current.value,
                    email: emailRef.current.value,
                    password: passwordRef.current.value
                }, {
                    headers: {
                        "Content-Type": 'application/json'
                    }
                }).then(async res => {
                    if (res.status !== 201) {
                        toast({
                            title: "Tên đăng nhập không hợp lệ",
                            description: "Tên đăng nhập đã được sử dụng, hãy thử 1 cái khác",
                        })
                    } else {
                        await signIn('credentials', {
                            username: usernameRef.current!.value,
                            password: passwordRef.current!.value,
                            redirect: true,
                            callbackUrl: '/'
                        })
                    }
                })
            } else {
                toast({
                    title: "Có gì đó thiếu thiếu ???",
                    description: "Kiểm tra thông tin lại lần nữa!!",
                })
            }
        } else {
            if (usernameRef.current && usernameRef.current.value !== '' && passwordRef.current && passwordRef.current.value !== '') {
                const data = await signIn('credentials', {
                    username: usernameRef.current.value,
                    password: passwordRef.current.value,
                    redirect: true,
                    callbackUrl: '/'
                })
                if (data?.ok) {
                    toast({
                        title: "Đăng nhập thành công",
                        description: "Chào mừng bạn trở lại",
                    })
                } else if (data?.error) {
                    toast({
                        title: "Đăng nhập thất bại",
                        description: "Tên đăng nhập hoặc mật khẩu không đúng",
                    })
                }
            } else {
                toast({
                    title: "Có gì đó thiếu thiếu ???",
                    description: "Kiểm tra thông tin lại lần nữa!!",
                })
            }
        }
    }

    return (
        <div className="w-full h-full p-8 flex items-center justify-center mt-[-100px]">
            <div className="w-[500px] h-fit p-6 flex flex-col gap-2">
                <p className="text-2xl text-center mb-7">{mode ? 'Đăng ký tài khoản Lyart' : 'Đăng nhập với tài khoản Lyart'}</p>
                <Label>
                    {!mode ? 'Tên đăng nhập hoặc email' : 'Tên đăng nhập'}
                    <Input className="mt-2 bg-slate-100 dark:bg-slate-800" type="text" ref={usernameRef} />
                </Label>
                {mode ? <Label>
                    Email
                    <Input className="mt-2 bg-slate-100 dark:bg-slate-800" type="text" ref={emailRef} />
                </Label> : <></>}

                <Label>
                    Mật khẩu
                    <Input className="mt-2 bg-slate-100 dark:bg-slate-800" type="password" ref={passwordRef} onKeyDown={e => { if (e.key == 'Enter' && !mode) { handleRegister() } }} />
                </Label>
                {mode ? <Label>
                    Nhập lại mật khẩu
                    <Input className="mt-2 bg-slate-100 dark:bg-slate-800 relative outline-none border-none focus:border-0 after:absolute after:w-full after:h-[1px] after:bg-slate-400 after:focus:bg-black after:bottom-0" type="password" ref={confirmPasswordRef} onKeyDown={e => { if (e.key == 'Enter') { handleRegister() } }} />
                </Label> : <></>}
                <p className="my-3 text-lg font-semibold underline cursor-pointer text-center" onClick={e => setMode(prev => !prev)}>{!mode ? 'Chưa có tài khoản? -> đăng ký ngay' : 'Đã có tài khoản? -> đăng nhập'}</p>
                <button className={`w-full h-14 py-2 rounded-sm text-xl font-bold bg-emerald-500 ${theme == 'light' ? 'text-black' : 'text-white'}`} onClick={() => { handleRegister() }}>{!mode ? 'Đăng nhâp' : 'Đăng ký'}</button>

                <div className="w-full mt-3">
                    <button className={`w-1/3 h-14 py-2 rounded-sm text-xl font-bold bg-slate-900 text-white`} onClick={() => { signIn("github") }}>github</button>
                </div>
            </div>
        </div>
    )
}