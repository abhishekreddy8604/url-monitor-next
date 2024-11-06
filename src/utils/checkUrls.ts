// src/utils/checkUrls.ts
import { prisma } from '@/lib/db';

export async function checkUrlStatus(url: string): Promise<number> {
  try {
    const response = await fetch(url, {
      method: 'GET',  // Changed from HEAD to GET as some servers might not support HEAD
      headers: {
        'User-Agent': 'URL-Monitor-Bot/1.0',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    return response.status;
  } catch (error) {
    console.error(`Error checking URL ${url}:`, error);
    return 503; // Service Unavailable
  }
}

export async function checkAllUrls() {
  console.log('Starting URL check...');
  try {
    const urls = await prisma.url.findMany();
    
    for (const url of urls) {
      try {
        console.log(`Checking URL: ${url.url}`);
        const status = await checkUrlStatus(url.url);
        
        await prisma.url.update({
          where: { id: url.id },
          data: {
            status,
            lastChecked: new Date(),
          },
        });
        
        console.log(`Updated status for ${url.url}: ${status}`);
      } catch (error) {
        console.error(`Error processing URL ${url.url}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in checkAllUrls:', error);
    throw error;
  }
}