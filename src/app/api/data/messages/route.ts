import { NextResponse } from 'next/server';
import * as memoryCache from '@/utils/memoryCache';

// 缓存键
const MESSAGES_CACHE_KEY = 'wx_messages';

export async function GET() {
  try {
    // 从内存缓存中读取消息
    const messages = memoryCache.get<any[]>(MESSAGES_CACHE_KEY) || [];
    
    // 返回消息，最新的消息排在前面
    return NextResponse.json([...messages].reverse());
  } catch (error) {
    console.error('Error reading messages data:', error);
    return NextResponse.json({ error: 'Failed to read messages data' }, { status: 500 });
  }
} 