import { redirect } from 'next/navigation'

export function RedirectIfNotAuthen({ callback }: { callback: string }) {
    redirect(`/api/auth/signin?callbackUrl=${callback}`)
}

export function ReduceString({ string, maxLength }: { string: string, maxLength: number }) {
    if (!string) {
        return '';
    }
    if (string.length > maxLength) {
        return string.substring(0, maxLength) + '...';
    } else {
        return string;
    }
}


export function FormatDateTime(dateTime: Date) {
    const currentTime: any = new Date();
    const inputTime: any = new Date(dateTime);

    const timeDiff: any = Math.abs(currentTime - inputTime); // Độ chênh lệch thời gian

    // Đổi milliseconds thành phút
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    if (minutesDiff < 1) {
        return "Vừa xong";
    } else if (minutesDiff < 60) {
        return minutesDiff + " phút trước";
    } else if (minutesDiff < 1440) {
        const hoursDiff = Math.floor(minutesDiff / 60);
        return hoursDiff + " giờ trước";
    } else if (minutesDiff < 43200) {
        const daysDiff = Math.floor(minutesDiff / 1440);
        return daysDiff + " ngày trước";
    } else if (minutesDiff < 525600) {
        const monthsDiff = Math.floor(minutesDiff / 43200);
        return monthsDiff + " tháng trước";
    } else {
        const yearsDiff = Math.floor(minutesDiff / 525600);
        return yearsDiff + " năm trước";
    }
}

export function makeid() {
    let length = 8;
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

export const getFileExt = (fileName: File) => {
    return fileName.name.substring(fileName.name.lastIndexOf(".") + 1);
};
const domain = 'lyart.pro.vn'
const protocol = 'https'
// const domain = 'localhost:3000'
// const protocol = 'http'
export const baseURL = protocol + '://' + domain
export const fileURL = protocol + '://file.' + domain
export const liveURL = protocol + '://live.' + domain
export const liveSocketURL = `${protocol}://socket.${domain}/live`
export const chatSocketURL = `${protocol}://socket.${domain}/chat`

const formatHelper = (time: number) => {
    if (time >= 3600) {
        return `${Math.floor(time / 3600)}:${Math.floor(time % 3600 / 60)}:${time % 60}`;
    } else if (time >= 60) {
        return `${Math.floor(time / 60)}:${time % 60}`;
    } else {
        return `0:${time}`;
    }
}

export const videoTimeFormater = (current: number, duration: number) => {
    return `${formatHelper(current)}/${formatHelper(duration)}`;
}