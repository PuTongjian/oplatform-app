import { NextRequest, NextResponse } from 'next/server';
import { decryptWxMessage } from '@/utils/wxMessageCrypto';
import * as memoryCache from '@/utils/memoryCache';

// 缓存键前缀
const MESSAGES_CACHE_KEY_PREFIX = 'wx_messages_';

export async function POST(request: NextRequest, { params }: { params: Promise<{ appid: string }> }) {
  try {
    // 获取路径中的appid
    const { appid } = await params;
    console.log('Processing request for appid:', appid);

    // 构建特定appid的缓存键
    const MESSAGES_CACHE_KEY = `${MESSAGES_CACHE_KEY_PREFIX}${appid}`;
    
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
      appid,
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
    let messages = memoryCache.get<any[]>(MESSAGES_CACHE_KEY) || [];
    
    // 添加新消息
    messages.push(messageInfo);
    
    // 限制存储的消息数量，防止内存溢出
    if (messages.length > 100) {
      messages = messages.slice(-100); // 只保留最新的100条消息
    }
    
    // 将消息存入缓存
    memoryCache.set(MESSAGES_CACHE_KEY, messages);

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