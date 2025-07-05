import axios from 'axios';
import wechatConfig from '@/config/wechatConfig';
import * as memoryCache from '@/utils/memoryCache';

// 定义ticket数据的接口
interface TicketData {
  ticket: string;
  appId?: string;
  createTime?: string;
  receivedAt?: string;
  raw?: any;
}

let tokenCache: {
  access_token: string;
  expires_at: number; // 过期时间点的时间戳
} | null = null;

/**
 * 从微信服务器获取新的组件 access_token
 */
async function fetchNewAccessToken(): Promise<string> {
  try {
    const url = 'https://api.weixin.qq.com/cgi-bin/component/api_component_token';
    
    // 获取ticket数据
    const ticketData = await fetchComponentVerifyTicket();
    
    const response = await axios.post(url, {
      component_appid: wechatConfig.appId,
      component_appsecret: wechatConfig.appSecret,
      component_verify_ticket: ticketData,
    });
    
    if (response.data.errcode) {
      throw new Error(`获取access_token失败: ${response.data.errcode} ${response.data.errmsg}`);
    }
    
    // 更新缓存
    tokenCache = {
      access_token: response.data.component_access_token,
      // 设置过期时间点为当前时间加上过期时间（秒），并留10分钟的缓冲
      expires_at: Date.now() + (response.data.expires_in - 600) * 1000,
    };
    
    return tokenCache.access_token;
  } catch (error) {
    console.error('获取access_token错误:', error);
    throw error;
  }
}

/**
 * 从内存缓存中获取component_verify_ticket
 */
async function fetchComponentVerifyTicket(): Promise<string> {
  try {
    // 直接从内存缓存获取ticket数据
    const ticketData = memoryCache.get<TicketData>('component_verify_ticket');
    
    if (!ticketData || !ticketData.ticket) {
      throw new Error('无效的ticket数据，请确保已接收到微信推送的ticket');
    }
    
    return ticketData.ticket;
  } catch (error) {
    console.error('获取component_verify_ticket错误:', error);
    throw error;
  }
}

/**
 * 确保获取有效的access_token
 * 如果缓存中有未过期的token，直接返回
 * 如果没有或已过期，则重新获取
 */
export async function ensureAccessToken(): Promise<string> {
  // 如果没有缓存或token已过期，重新获取
  if (!tokenCache || Date.now() >= tokenCache.expires_at) {
    return await fetchNewAccessToken();
  }
  
  // 返回缓存的token
  return tokenCache.access_token;
}

/**
 * 强制刷新token
 */
export async function refreshAccessToken(): Promise<string> {
  return await fetchNewAccessToken();
}

/**
 * 获取当前token的信息（用于前端显示）
 */
export function getTokenInfo() {
  if (!tokenCache) {
    return { status: 'missing', message: '未获取token' };
  }
  
  const now = Date.now();
  const expiresIn = Math.floor((tokenCache.expires_at - now) / 1000); // 剩余有效期（秒）
  
  if (now >= tokenCache.expires_at) {
    return { 
      status: 'expired', 
      message: '已过期',
      token: tokenCache.access_token,
      expires_at: new Date(tokenCache.expires_at).toLocaleString(),
    };
  }
  
  return {
    status: 'valid',
    message: `有效，剩余 ${Math.floor(expiresIn / 60)} 分 ${expiresIn % 60} 秒`,
    token: tokenCache.access_token,
    expires_at: new Date(tokenCache.expires_at).toLocaleString(),
    expires_in: expiresIn,
  };
} 