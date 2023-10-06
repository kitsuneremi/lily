import prisma from '@/lib/prisma';

interface RequestBody {
    content: string;
    room: number;
    accountId: number;
}

type newMessages = {
    roomId: number,
    member: {
        id: number,
        roomId: number,
        accountId: number,
        name: string
    } | unknown
    content: string,
    createdAt: Date
}

export async function POST(req: Request) {
    const body: RequestBody = await req.json();

    const mem = await prisma.member.findFirst({
        where: {
            roomId: body.room,
            accountId: body.accountId
        }
    })
    console.log(mem)
    if (mem != null) {
        const msg = await prisma.message.create({
            data: {
                content: body.content,
                roomId: body.room,
                memberId: mem.id
            }
        })
        return new Response(JSON.stringify(msg));
    }


    return new Response(null, { status: 204 })
}


export async function GET(req: Request) {
    const url = new URL(req.url);
    const params = {
        room: url.searchParams.get('room')
    };

    if (params.room != null) {
        const messages = await prisma.message.findMany({
            where: {
                roomId: Number.parseInt(params.room)
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Mảng promises để lưu trữ tất cả các promises
        const memberPromises = messages.map(mes =>
            prisma.member.findFirst({
                where: {
                    id: mes.memberId
                }
            })
        );

        // Chờ tất cả các promises được giải quyết
        const memberResults = await Promise.all(memberPromises);

        // Tạo mảng newMessages bằng cách kết hợp thông tin từ messages và memberResults
        const newMessages = messages.map((mes, index) => ({
            ...mes,
            member: memberResults[index]
        }));

        return new Response(JSON.stringify(newMessages));
    } else {
        return new Response(null, { status: 404 });
    }
}
