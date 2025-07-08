import axios from 'axios';
import wechatConfig from '@/config/wechatConfig';
import * as credentialsManager from '@/utils/credentialsManager';

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

    const tokenData = {
      access_token: response.data.component_access_token,
      // 设置过期时间点为当前时间加上过期时间（秒），并留10分钟的缓冲
      expires_at: Date.now() + (response.data.expires_in - 600) * 1000,
    };

    // 保存到文件和内存中
    credentialsManager.saveComponentAccessToken(tokenData);

    return tokenData.access_token;
  } catch (error) {
    console.error('获取access_token错误:', error);
    throw error;
  }
}

/**
 * 获取component_verify_ticket
 */
async function fetchComponentVerifyTicket(): Promise<string> {
  try {
    const ticketData = credentialsManager.getComponentVerifyTicket();

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
  const tokenData = credentialsManager.getComponentAccessToken();

  // 如果没有缓存或token已过期，重新获取
  if (!tokenData || Date.now() >= tokenData.expires_at) {
    return await fetchNewAccessToken();
  }

  // 返回缓存的token
  return tokenData.access_token;
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
  const tokenData = credentialsManager.getComponentAccessToken();

  if (!tokenData) {
    return { status: 'missing', message: '未获取token' };
  }

  const now = Date.now();
  const expiresIn = Math.floor((tokenData.expires_at - now) / 1000); // 剩余有效期（秒）

  if (now >= tokenData.expires_at) {
    return {
      status: 'expired',
      message: '已过期',
      token: tokenData.access_token,
      expires_at: new Date(tokenData.expires_at).toLocaleString(),
    };
  }

  return {
    status: 'valid',
    message: `有效，剩余 ${Math.floor(expiresIn / 60)} 分 ${expiresIn % 60} 秒`,
    token: tokenData.access_token,
    expires_at: new Date(tokenData.expires_at).toLocaleString(),
    expires_in: expiresIn,
  };
} 