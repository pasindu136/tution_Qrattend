import { sendSystemStatusReport } from '@/app/admin/actions';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');

        // Simple security: Check for a secret token "Bearer CRON_SECRET"
        // User should add CRON_SECRET to their env variables if they want to secure it.
        // For now, if no secret is set in env, we might skip check or rely on Vercel Cron protection.
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        await sendSystemStatusReport(false);
        return NextResponse.json({ success: true, message: 'Daily report sent.' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
