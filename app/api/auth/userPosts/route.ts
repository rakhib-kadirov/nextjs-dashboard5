import { db } from "@/app/lib/db";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const session = await auth()
        const { body_text } = await request.json()
        const dateNow = new Date(Date.now())

        // const [result] = await db.query(
        //     "INSERT INTO posts_user (users_id, body_text, date) VALUES (?, ?, ?)",
        //     [session?.user.id!, body_text, dateNow]
        // )

        const messages = await prisma.posts_user.create({
            data: {
                users_id: parseInt(session?.user.id as string),
                first_name: session?.user.first_name as string,
                last_name: session?.user.last_name as string,
                body_text: body_text,
                date: dateNow,
            },
            select: {
                users_id: true,
                first_name: true,
                last_name: true,
                body_text: true,
                date: true,
            }
        })

        return NextResponse.json(
            { success: true, postId: (messages as any).insertId },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("Ошибка: Ошибка публикации поста!", error.message)

        return NextResponse.json(
            { success: true, error: 'Ошибка сервера.' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        // const url = new URL(request.url);
        // const id = url.pathname.split("/").pop()

        const session = await auth()
        const sql = `
            SELECT posts_user.id_post, posts_user.body_text, posts_user.date, posts_user.users_id, users.id, users.first_name, users.last_name, users.profile_photo
            FROM posts_user
            JOIN users ON posts_user.users_id = users.id
            WHERE posts_user.users_id = ?
            ORDER BY posts_user.date DESC
        `
        const [posts] = await db.query(sql, [session?.user.id])

        return NextResponse.json({ posts: posts })
    } catch (error: any) {
        console.error("Ошибка: Ошибка поиска постов!", error.message)

        return NextResponse.json(
            { success: true, error: 'Ошибка сервера.' },
            { status: 500 }
        )
    }
}