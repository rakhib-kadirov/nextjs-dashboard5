import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();  // ⬅ Принудительно вызываем session()
        console.log("DEBUG API - Session:", session); // ✅ Логируем сессию

        return NextResponse.json(session);
    } catch (error: any) {
        console.error("Ошибка: Ошибка session!", error.message)

        return NextResponse.json(
            { success: true, error: 'Ошибка сервера. Session' },
            { status: 500 }
        )
    }
}
