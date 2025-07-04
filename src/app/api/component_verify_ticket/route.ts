import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { decryptWxMessage, extractWxMessageData } from '@/utils/wxMessageCrypto';

// 定义存储路径
const DATA_DIR = path.join(process.cwd(), 'data');
const TICKET_FILE = path.join(DATA_DIR, 'component_verify_ticket.txt');

// 确保目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    // 获取请求参数
    const url = request.url;
    const urlParams = new URL(url).searchParams;
    const timestamp = urlParams.get('timestamp');
    const nonce = urlParams.get('nonce');
    const msgSignature = urlParams.get('msg_signature');
    
    // 读取请求体
    const rawData = await request.text();
    console.log('Received raw data:', rawData);

    // 使用公共函数解密消息
    const decryptResult = await decryptWxMessage(
      rawData,
      msgSignature,
      timestamp,
      nonce
    );
    
    console.log('解密结果:', {
      isEncrypted: decryptResult.isEncrypted,
      signatureValid: decryptResult.signatureValid,
      hasDecryptedData: !!decryptResult.decryptedData
    });
    
    // 优先从解密数据中提取信息，如果没有解密数据则从原始数据提取
    const dataToUse = decryptResult.decryptedData || decryptResult.rawData;
    
    // 提取ticket信息
    const messageData = extractWxMessageData(dataToUse);
    console.log('提取的消息数据:', messageData);
    
    // 检查是否为ticket消息
    if (messageData && messageData.ComponentVerifyTicket && messageData.InfoType === 'component_verify_ticket') {
      // 存储ticket信息
      const ticketInfo = JSON.stringify({
        ticket: messageData.ComponentVerifyTicket,
        appId: messageData.AppId,
        createTime: messageData.CreateTime,
        receivedAt: new Date().toISOString(),
        raw: dataToUse,
      }, null, 2);
      
      // 将ticket写入文件（覆盖写入，因为ticket是唯一的）
      fs.writeFileSync(TICKET_FILE, ticketInfo);
      
      console.log('Ticket stored successfully');
    }

    // 按照文档要求，返回success字符串
    return new NextResponse('success', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (error) {
    console.error('Error processing ticket:', error);
    return new NextResponse('success', {
      status: 200, // 即使出错也返回success，避免微信服务器重试
      headers: { 'Content-Type': 'text/plain' }
    });
  }
} 