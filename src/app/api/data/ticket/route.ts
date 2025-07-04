import { NextResponse } from 'next/server';
import * as memoryCache from '@/utils/memoryCache';

// 缓存键
const TICKET_CACHE_KEY = 'component_verify_ticket';

export async function GET() {
  try {
    // 从内存缓存中读取ticket
    const ticket = memoryCache.get(TICKET_CACHE_KEY);
    
    if (!ticket) {
      return NextResponse.json(null, { status: 404 });
    }
    
    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error reading ticket data:', error);
    return NextResponse.json({ error: 'Failed to read ticket data' }, { status: 500 });
  }
} 