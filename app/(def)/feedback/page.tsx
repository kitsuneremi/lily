export default function Page(){

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-fit h-fit">
                <textarea className="w-[500px] max-w-[80vw] min-h-[240px] rounded-lg">

                </textarea>
                <div className="flex gap-5 h-max justify-around">
                    <img src='https://i.imgflip.com/5rh6bx.png' alt='' className="w-28 h-28 rounded-lg"/>
                    <div className="h-28 flex items-center"><button className='px-3 py-1 rounded-lg bg-cyan-500'>Đóng góp ý kiến của bạn</button></div>
                </div>
            </div>
        </div>
    )
}