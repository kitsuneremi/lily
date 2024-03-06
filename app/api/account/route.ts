import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    const accounts = await prisma.account.findMany();
    const accountsWithoutPassword = accounts.map(account => {
        const { password, username, ...rest } = account;
        return rest;
    });

    return new Response(JSON.stringify(accountsWithoutPassword));
}