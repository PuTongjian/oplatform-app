import { parseStringPromise } from 'xml2js';
import { WXBizMsgCrypt } from './wxBizMsgCrypt';
import wechatConfig from '@/config/wechatConfig';

/**
 * 微信消息解密接口
 */
export interface WxMessageDecryptResult {
  isEncrypted: boolean;  // 是否是加密消息
  rawData: any;          // 原始解析数据
  decryptedData: any;    // 解密后的数据（如果是加密消息）
  signatureValid?: boolean; // 签名是否有效（如果提供了签名参数）
}

/**
 * 解密微信消息
 * @param rawXml 原始XML字符串
 * @param msgSignature 消息签名
 * @param timestamp 时间戳
 * @param nonce 随机数
 * @returns 解密结果
 */
export async function decryptWxMessage(
  rawXml: string,
  msgSignature?: string | null,
  timestamp?: string | null,
  nonce?: string | null
): Promise<WxMessageDecryptResult> {
  // 解析XML
  const parsedData = await parseStringPromise(rawXml);
  
  // 默认结果
  const result: WxMessageDecryptResult = {
    isEncrypted: false,
    rawData: parsedData,
    decryptedData: null
  };
  
  // 检查是否有加密内容
  if (!parsedData?.xml?.Encrypt?.[0]) {
    return result;
  }
  
  // 有加密内容
  result.isEncrypted = true;
  const encrypt = parsedData.xml.Encrypt[0];
  
  try {
    // 初始化解密工具
    const wxCrypt = new WXBizMsgCrypt(
      wechatConfig.token, 
      wechatConfig.encodingAESKey, 
      wechatConfig.appId
    );
    
    // 验证消息签名
    if (msgSignature && timestamp && nonce) {
      result.signatureValid = wxCrypt.verifySignature(
        msgSignature, 
        timestamp, 
        nonce, 
        encrypt
      );
      
      if (!result.signatureValid) {
        console.warn('签名验证失败');
      }
    }
    
    // 解密消息
    const decrypted = wxCrypt.decrypt(encrypt);
    
    // 解析解密后的XML
    result.decryptedData = await parseStringPromise(decrypted.message);
  } catch (error) {
    console.error('解密或解析失败:', error);
  }
  
  return result;
}

/**
 * 提取解密后的微信消息中的关键信息
 * @param decryptedData 解密后的数据
 * @returns 提取的关键信息
 */
export function extractWxMessageData(decryptedData: any) {
  if (!decryptedData?.xml) {
    return null;
  }
  
  // 提取通用字段
  const extracted: Record<string, any> = {};
  
  // 常见字段映射
  const commonFields = [
    'ToUserName', 'FromUserName', 'CreateTime', 'MsgType', 
    'Event', 'EventKey', 'Content', 'ComponentVerifyTicket', 
    'InfoType', 'AppId'
  ];
  
  // 提取所有可用字段
  for (const field of commonFields) {
    if (decryptedData.xml[field] && decryptedData.xml[field][0]) {
      extracted[field] = decryptedData.xml[field][0];
    }
  }
  
  return extracted;
} 