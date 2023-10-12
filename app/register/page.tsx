'use client'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { signIn, useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import axios, { AxiosHeaders } from 'axios'
import { useRouter } from "next/navigation"

export default function Page(){
    const router = useRouter()
    const {data: session} = useSession();

    useEffect(() => {
        if(session && session.user){
            router.push('/')
        }
    },[])

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
                }, {headers: {
                    "Content-Type": 'application/json'
                }}).then(async res =>  {
                    if(res.status !== 201){
                        toast({
                            title: "Tên đăng nhập không hợp lệ",
                            description: "Tên đăng nhập đã được sử dụng, hãy thử 1 cái khác",
                        })
                    }else{
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
                await signIn('credentials', {
                    username: usernameRef.current.value,
                    password: passwordRef.current.value,
                    redirect: true,
                    callbackUrl: '/'
                })
            } else {
                toast({
                    title: "Có gì đó thiếu thiếu ???",
                    description: "Kiểm tra thông tin lại lần nữa!!",
                })
            }
        }
    }

    return (
        <div className="w-full h-full p-8 flex items-center mt-[-100px]">
            <div className="w-[500px] h-fit p-6 mx-auto flex flex-col gap-2">
                <p className="text-2xl text-center mb-7">{mode ? 'Đăng ký tài khoản Nice' : 'Đăng nhập với tài khoản Nice'}</p>
                <Label>
                    {!mode ? 'Tên đăng nhập hoặc email' : 'Tên đăng nhập'}
                    <Input className="mt-2" type="text" ref={usernameRef} />
                </Label>
                {mode ? <Label>
                    Email
                    <Input className="mt-2" type="text" ref={emailRef} />
                </Label> : <></>}

                <Label>
                    Mật khẩu
                    <Input className="mt-2" type="password" ref={passwordRef} onKeyDown={e => { if (e.key == 'Enter' && !mode) { handleRegister() } }} />
                </Label>
                {mode ? <Label>
                    Nhập lại mật khẩu
                    <Input className="mt-2 relative outline-none border-none focus:border-0 after:absolute after:w-full after:h-[1px] after:bg-slate-400 after:focus:bg-black after:bottom-0" type="password" ref={confirmPasswordRef} onKeyDown={e => { if (e.key == 'Enter') { handleRegister() } }} />
                </Label> : <></>}
                <p className="my-2 underline cursor-pointer text-center" onClick={e => setMode(prev => !prev)}>{!mode ? 'Chưa có tài khoản?, đăng ký ngay' : 'Đã có tài khoản?'}</p>
                <button className={`w-full h-10 text-xl bg-emerald-500 ${theme == 'light' ? 'text-black' : 'text-white'}`} onClick={() => { handleRegister() }}>{!mode ? 'Đăng nhâp' : 'Đăng ký'}</button>
            </div>
        </div>
    )
}