import { NextResponse } from 'next/server';
import * as memoryCache from '@/utils/memoryCache';

// 消息缓存键
const MESSAGES_CACHE_KEY = 'received_messages';

// 获取已接收消息的API端点
export async function GET() {
  try {
    // 从内存缓存中获取消息列表
    const messages = memoryCache.get(MESSAGES_CACHE_KEY) || [];
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: `Failed to fetch messages: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 