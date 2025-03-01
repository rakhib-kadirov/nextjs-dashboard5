// import { auth } from "@/auth";
// import { User } from "./definitions";
// import { PrismaClient } from "@prisma/client";
// import { NextRequest } from "next/server";

// const prisma = new PrismaClient()

// export async function getUser(login: string): Promise<User | undefined> {
//     const session = await auth()
//     try {
//         console.log('Login: ', login, " - ", session?.user.id)
//         // const [user] = await db.query(`SELECT * FROM users WHERE login = ?`, [login])
//         const user = prisma.users.findUnique({
//             where: {
//                 id: parseInt(session?.user.id as string),
//                 // login: login
//             }
//         })
//         console.log('Fetched user from database: ', user); // Логирование полученного пользователя

//         if (!Array.isArray(user) || user.length === 0) {
//             return undefined;
//         }

//         console.log('USER: ', user[0])
//         return user[0] as User
//     } catch (error) {
//         console.error('Failed to fetch user: ', error)
//         throw new Error('Failed to fetch user.')
//     }
// }