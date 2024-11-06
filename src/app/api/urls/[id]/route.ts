// src/app/api/urls/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    
    const url = await prisma.url.delete({
      where: { id },
    });

    return NextResponse.json(url);
  } catch (error) {
    console.error('Error deleting URL:', error);
    return NextResponse.json(
      { error: 'Failed to delete URL' }, 
      { status: 500 }
    );
  }
}