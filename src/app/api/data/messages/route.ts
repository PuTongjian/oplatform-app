import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// 定义存储路径
const DATA_DIR = path.join(process.cwd(), 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.txt');

export async function GET() {
  try {
    // 确保文件存在
    if (!fs.existsSync(MESSAGES_FILE)) {
      return NextResponse.json([], { status: 200 });
    }

    // 读取消息数据
    const messagesData = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    const messages = JSON.parse(messagesData);
    
    // 返回消息，最新的消息排在前面
    return NextResponse.json(messages.reverse());
  } catch (error) {
    console.error('Error reading messages data:', error);
    return NextResponse.json({ error: 'Failed to read messages data' }, { status: 500 });
  }
} 