// src/app/api/urls/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const urls = await prisma.url.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(urls);
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch URLs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = await prisma.url.create({
      data: {
        url: body.url,
        name: body.name,
      },
    });
    return NextResponse.json(url);
  } catch (error) {
    console.error('Error creating URL:', error);
    return NextResponse.json(
      { error: 'Failed to create URL' },
      { status: 500 }
    );
  }
}