import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { decryptWxMessage } from '@/utils/wxMessageCrypto';

// 定义存储路径
const DATA_DIR = path.join(process.cwd(), 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.txt');

// 确保目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 确保消息文件存在
if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, '[]');
}

export async function POST(request: NextRequest) {
  try {
    // 获取请求参数和请求体
    const url = request.url;
    const urlParams = new URL(url).searchParams;
    const signature = urlParams.get('signature');
    const timestamp = urlParams.get('timestamp');
    const nonce = urlParams.get('nonce');
    const openid = urlParams.get('openid');
    const encryptType = urlParams.get('encrypt_type');
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
    
    // 存储消息
    const messageInfo = {
      receivedAt: new Date().toISOString(),
      params: {
        signature, timestamp, nonce, openid, encryptType, msgSignature
      },
      rawData,
      parsedData: decryptResult.rawData,
      decryptedData: decryptResult.decryptedData,
      isEncrypted: decryptResult.isEncrypted,
      signatureValid: decryptResult.signatureValid
    };
    
    // 读取现有消息
    let messages = [];
    try {
      const existingData = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      messages = JSON.parse(existingData);
    } catch (error) {
      console.error('Error reading messages file:', error);
    }
    
    // 添加新消息
    messages.push(messageInfo);
    
    // 将消息写入文件（追加写入）
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    
    console.log('Message stored successfully');

    // 按照文档要求，返回success字符串
    return new NextResponse('success', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (error) {
    console.error('Error processing message:', error);
    return new NextResponse('success', {
      status: 200, // 即使出错也返回success，避免微信服务器重试
      headers: { 'Content-Type': 'text/plain' }
    });
  }
} 