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


export async function PATCH(
    request: Request,
    context: { params: { id: string } }
  ) {
    try {
      const id = context.params.id;
      const data = await request.json();
  
      const url = await prisma.url.update({
        where: { id },
        data: {
          status: data.status,
          lastChecked: data.lastChecked,
        },
      });
  
      return NextResponse.json(url);
    } catch (error) {
      console.error('Error updating URL:', error);
      return NextResponse.json(
        { error: 'Failed to update URL' },
        { status: 500 }
      );
    }
  }