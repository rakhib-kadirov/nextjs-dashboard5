import { NextResponse } from 'next/server';
import Pusher from 'pusher'

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.PUSHER_APP_KEY as string,
    secret: process.env.PUSHER_APP_SECRET as string,
    cluster: "eu",
    useTLS: true
});

export default async function handler(req: { body: { message: string; }; }) {
    await pusher.trigger("chat", "message", {
        text: req.body.message
    });

    NextResponse.json(
        { success: true },
        { status: 500 }
    )
}