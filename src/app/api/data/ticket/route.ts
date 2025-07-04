import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// 定义存储路径
const DATA_DIR = path.join(process.cwd(), 'data');
const TICKET_FILE = path.join(DATA_DIR, 'component_verify_ticket.txt');

export async function GET() {
  try {
    // 确保文件存在
    if (!fs.existsSync(TICKET_FILE)) {
      return NextResponse.json(null, { status: 404 });
    }

    // 读取ticket数据
    const ticketData = fs.readFileSync(TICKET_FILE, 'utf-8');
    const ticket = JSON.parse(ticketData);
    
    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error reading ticket data:', error);
    return NextResponse.json({ error: 'Failed to read ticket data' }, { status: 500 });
  }
} 