import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const users = await prisma.users.findMany({
            select: {
                id: true,
                login: true,
                password: true,
                first_name: true,
                last_name: true,
            }
            // include: { message: true },
        })
        // const sql = "SELECT * FROM users"
        // const [users] = await db.query(sql)
        return NextResponse.json({ users })
    } catch (error) {
        return NextResponse.json({ error: error })
    }
}