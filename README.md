Dự án sử dụng nextjs 14
Chạy trực tiếp tại
```bash
    https://lyart.pro.vn
```

Bạn có thể test backend qua
```bash
    https://file.lyart.pro.vn/api/merge/cldByLt6/live
```
mở file bằng VLC player :v

### hãy báo cho tôi nếu thấy web sập ;~: qua [facebook](https://facebook.com/kitsuneremi)

# đây là project clone youtube cả fe lẫn be chứ không có code mỗi fe xong gắn link video youtube xong gắn vào đâu nhé

## 1 số thông tin về project
- dự án này bao gồm cả phần front-end lẫn backend, storage, server,...
- frontend: nextjs 14
- backend: nextjs api, expressjs,
- proxy server: nginx

- mô tả thêm về quy trình hoạt động
- - ví dụ như khi mà đăng tải 1 video lên thì fe sẽ gửi http post request đến phía be là express: https://file.lyart.pro.vn.com
- - phía server nhận file này và dùng ffmpeg chia video thành các file dịnh dạng hls (.m3u8 và .ts) với độ phân giải gốc và nhỏ hơn 1.5 lần
- - khi vào xem video đã được đăng lên thì call đến api be và lấy file m3u8 sau đó hls.js tự động đọc file m3u8 và lấy ra các file .ts để chạy dc video
- - nhắc lại là đây là project clone youtube chứ không có lấy link video youtube xong gắn vào đâu nhé

## video server và 1 vài server khác (đang phát triển)

- yêu cầu server video để có thể chạy được [lily-video-server](https://github.com/kitsuneremi/neckmoo-video-server)
- server này sẽ được update lên typescript trong tương lai~~~

## Bắt đầu

Đầu tiên chạy npm install/yarn add

```bash
npm i

yarn add
```

Sau đó chạy lệnh run dev để khởi động môi trường dev

```bash
npm run dev

yarn dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt web của bạn

