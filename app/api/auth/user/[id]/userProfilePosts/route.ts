import { db } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const session = await auth()
        const { body_text, id_post } = await request.json()
        const dateNow = new Date(Date.now())
        // const [result] = await db.query(
        //     "INSERT INTO posts_user (users_id, body_text, date) VALUES (?, ?, ?)",
        //     [session?.user.id, body_text, dateNow]
        // )
        const result = await prisma.posts_user.create({
            data: {
                users_id: parseInt(session?.user.id as string),
                body_text: body_text,
                date: dateNow,
                id_post: id_post,
                first_name: session?.user.first_name as string,
                last_name: session?.user.last_name as string,
            }
        })

        return NextResponse.json(
            { success: true, postId: (result as any).insertId },
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

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const parts = url.pathname.split("/")
        const userIndex = parts.indexOf("user");
        const id = userIndex !== -1 && parts[userIndex + 1] ? parts[userIndex + 1] : null;

        const sql = `
            SELECT posts_user.id_post, posts_user.body_text, posts_user.date, posts_user.users_id, users.id, users.first_name, users.last_name, users.profile_photo
            FROM posts_user
            JOIN users ON posts_user.users_id = users.id
            WHERE posts_user.users_id = ?
            ORDER BY posts_user.date DESC
        `
        const [posts] = await db.query(sql, [id])

        return NextResponse.json({ posts: posts })
    } catch (error: any) {
        console.error("Ошибка: Ошибка поиска постов!", error.message)

        return NextResponse.json(
            { success: true, error: 'Ошибка сервера.' },
            { status: 500 }
        )
    }
}