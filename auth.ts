import NextAuth, {
    NextAuthConfig,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import type { User } from '@/app/lib/definitions'
import bcrypt from 'bcrypt'
import { PrismaClient } from "@prisma/client";


interface CustomUser {
    id: string;
    login: string;
    first_name: string;
    last_name: string;
    profile_photo: string;
}

const prisma = new PrismaClient()

async function getUser(login: string): Promise<User | undefined> {
    // const session = await auth()
    try {
        console.log('Login: ', login)
        const user = await prisma.users.findUnique({
            where: { login: login }
        })
        console.log('Fetched user from database: ', user); // Логирование полученного пользователя

        if (!Array.isArray([user]) || [user].length === 0) {
            return undefined;
        }

        console.log('USER: ', [user][0])
        return [user][0] as unknown as User
    } catch (error) {
        console.error('Failed to fetch user: ', error)
        throw new Error('Failed to fetch user.')
    }
}

export const authConfig: NextAuthConfig = ({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                login: { label: "Login", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.login || !credentials?.password) {
                    throw new Error("Не переданы учетные данные");
                }

                console.log("Credentials received: ", credentials.login, credentials.password);  // Логирование данных

                const parsedCredentials = z
                    .object({ login: z.string().min(3), password: z.string().min(6) })
                    .safeParse(credentials);
                console.log("PARSED CREDENTIALS: ", parsedCredentials)

                if (parsedCredentials.success) {
                    const { login, password } = parsedCredentials.data;
                    console.log("Parsed credentials: ", parsedCredentials.data);  // Логирование после парсинга
                    console.log("LOGIN: ", login);  // Логирование после парсинга

                    const user = await getUser(login)
                    if (!user) {
                        console.log('User not found')
                        return null
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password)
                    if (!passwordsMatch) {
                        console.log('Password mismatch');
                        return null; // Пароль не совпал
                    }

                    console.log("Returning user from authorize: ", user)
                    return {
                        id: user.id,
                        login: user.login,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        profile_photo: user.profile_photo,
                    }
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const customUser = user as CustomUser
                token.id = customUser.id
                token.login = customUser.login
                token.first_name = customUser.first_name
                token.last_name = customUser.last_name
                token.profile_photo = customUser.profile_photo
            }

            return token
        },
        async session({ session, token }) {
            (session.user as any) = {
                ...session.user,
                id: token.id as string,
                login: token.login as string,
                first_name: token.first_name as string,
                last_name: token.last_name as string,
                profile_photo: token.profile_photo as string,
            };

            return session
        },
    },
    debug: true
})

export const { auth, signIn, signOut } = NextAuth(authConfig)