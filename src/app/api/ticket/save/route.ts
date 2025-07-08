import { NextResponse } from 'next/server';
import * as memoryCache from '@/utils/memoryCache';
import * as credentialsManager from '@/utils/credentialsManager';

// 保存ticket的API端点
export async function POST(request: Request) {
  try {
    const requestData = await request.json();

    if (!requestData || !requestData.data || !requestData.data.xml) {
      return NextResponse.json(
        { error: 'Invalid request data format' },
        { status: 400 }
      );
    }

    const xmlData = requestData.data.xml;

    // 验证必要字段
    if (!xmlData.ComponentVerifyTicket || !xmlData.AppId || !xmlData.CreateTime) {
      return NextResponse.json(
        { error: 'Missing required fields in ticket data' },
        { status: 400 }
      );
    }

    // 处理数组格式的数据（微信推送的XML解析后通常是这种格式）
    const ticket = Array.isArray(xmlData.ComponentVerifyTicket)
      ? xmlData.ComponentVerifyTicket[0]
      : xmlData.ComponentVerifyTicket;

    const appId = Array.isArray(xmlData.AppId)
      ? xmlData.AppId[0]
      : xmlData.AppId;

    const createTime = Array.isArray(xmlData.CreateTime)
      ? xmlData.CreateTime[0]
      : xmlData.CreateTime;

    // 准备要缓存的数据
    const ticketData = {
      ticket,
      appId,
      createTime,
      receivedAt: new Date().toISOString(),
      raw: requestData.data
    };

    // 保存到内存缓存和文件系统
    memoryCache.set('component_verify_ticket', ticketData);
    credentialsManager.saveComponentVerifyTicket(ticketData);

    return NextResponse.json({
      success: true,
      ticket: ticketData
    });

  } catch (error) {
    console.error('Error saving ticket:', error);
    return NextResponse.json(
      { error: `Failed to save ticket: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 