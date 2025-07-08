import { NextResponse } from 'next/server';
import * as memoryCache from '@/utils/memoryCache';
import * as credentialsManager from '@/utils/credentialsManager';

// 获取component_verify_ticket的API端点
export async function GET() {
  try {
    // 首先从内存缓存中获取ticket数据
    let ticketData = memoryCache.get('component_verify_ticket');

    // 如果内存中没有，尝试从文件中获取
    if (!ticketData) {
      ticketData = credentialsManager.getComponentVerifyTicket();
    }

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