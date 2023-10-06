import prisma from "@/lib/prisma"

export async function GET(req: Request) {

    const url = new URL(req.url)


    const accounts = await prisma.accounts.findMany();
    const accountsWithoutPassword = accounts.map(account => {
        const { password, ...rest } = account;
        return rest;
    });

    return new Response(JSON.stringify(accountsWithoutPassword));
}