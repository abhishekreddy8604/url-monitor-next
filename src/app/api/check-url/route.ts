import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      const response = await fetch(url, {
        method: 'HEAD', // Use HEAD instead of GET for better performance
        signal: controller.signal,
        headers: {
          'User-Agent': 'URL Monitor Bot',
        },
      });
      
      clearTimeout(timeoutId);
      return NextResponse.json({ status: response.status });
    } catch (error) {
      clearTimeout(timeoutId);
      return NextResponse.json({ status: 0 });
    }
  } catch (error) {
    console.error('Error checking URL:', error);
    return NextResponse.json(
      { error: 'Failed to check URL' },
      { status: 500 }
    );
  }
}