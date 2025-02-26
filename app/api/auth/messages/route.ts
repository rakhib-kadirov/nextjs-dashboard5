// import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET() {
    // const session = await auth()
    const messages = await prisma.message.findMany({
        where: {
            // first_name: session?.user.first_name as string,
            // last_name: session?.user.last_name as string,
            // users: {
            //     first_name: session?.user.first_name as string,
            //     last_name: session?.user.last_name as string,
            // }
        },
        orderBy: {
            createdAt: 'asc'
        },
        select: {
            id: true,
            userId: true,
            text: true,
            createdAt: true,
            first_name: true,
            last_name: true,
            profile_photo: true,
        }
        // include: { users: true },
        // orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ messages }, {
        status: 200,
        headers: { "Content-Type": "application/json" }
    })
}

export async function POST(req: NextRequest) {
    const { text, userId, first_name, last_name }: { text: string, userId: number, first_name: string, last_name: string } = await req.json()

    const user = await prisma.users.findUnique({
        where: {
            id: userId,
        }
    })
    if (!user) {
        return NextResponse.json({ error: 'Пользователь не найден.' }, { status: 404 })
    }

    const message = await prisma.message.create({
        data: { text, userId, first_name, last_name }
    })
    return NextResponse.json(message)
}