import { NextResponse } from 'next/server';
import * as memoryCache from '@/utils/memoryCache';

// 获取component_verify_ticket的API端点
export async function GET() {
  try {
    // 从内存缓存中获取ticket数据
    const ticketData = memoryCache.get('component_verify_ticket');
    
    if (!ticketData) {
      return NextResponse.json(null);
    }
    
    return NextResponse.json(ticketData);
  } catch (error) {
    console.error('Error fetching ticket data:', error);
    return NextResponse.json(
      { error: `Failed to fetch ticket data: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 