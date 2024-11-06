// src/app/api/cron/route.ts
import { NextResponse } from 'next/server';
import { checkAllUrls } from '@/utils/checkUrls';

export async function GET(request: Request) {
    return NextResponse.json({ status: 'healthy' }, { status: 200 });
}

export async function POST(request: Request) {
    try {
        // Optional: Add authentication
        const authHeader = request.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        console.log('Cron job triggered');
        await checkAllUrls();
        
        return NextResponse.json(
            { message: 'URLs checked successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in cron job:', error);
        return NextResponse.json(
            { error: 'Failed to check URLs' },
            { status: 500 }
        );
    }
}