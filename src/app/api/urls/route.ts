// src/app/api/urls/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkUrlStatus } from '@/utils/checkUrls';

export async function GET() {
  try {
    const urls = await prisma.url.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(urls);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch URLs' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { url, name } = await request.json();
    
    // Check URL status immediately
    const status = await checkUrlStatus(url);
    
    const newUrl = await prisma.url.create({
      data: {
        url,
        name,
        status,
        lastChecked: new Date(),
      },
    });
    
    return NextResponse.json(newUrl);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add URL' }, 
      { status: 500 }
    );
  }
}