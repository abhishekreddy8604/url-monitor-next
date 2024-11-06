import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function checkUrlStatus(url: string): Promise<number> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'URL Monitor Bot',
      },
    });

    clearTimeout(timeoutId);
    return response.status;
  } catch (error) {
    console.error(`Error checking URL ${url}:`, error);
    return 0;
  }
}

export async function checkAllUrls() {
  try {
    const urls = await prisma.url.findMany();
    
    const results = await Promise.all(
      urls.map(async (url) => {
        const status = await checkUrlStatus(url.url);
        return prisma.url.update({
          where: { id: url.id },
          data: {
            status,
            lastChecked: new Date(),
          },
        });
      })
    );

    return results;
  } catch (error) {
    console.error('Error checking all URLs:', error);
    throw error;
  }
}