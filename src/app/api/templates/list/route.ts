import { NextResponse } from 'next/server';
import { ensureAccessToken } from '@/utils/accessTokenManager';

// 获取模板库列表的API端点
export async function GET() {
  try {
    // 获取access_token
    let accessToken;
    try {
      accessToken = await ensureAccessToken();
    } catch (error) {
      console.error('获取access_token失败:', error);
      return NextResponse.json(
        { error: `获取access_token失败，请先确保已接收到微信推送的component_verify_ticket` },
        { status: 500 }
      );
    }
    
    // 调用微信API获取模板库列表
    const response = await fetch(
      `https://api.weixin.qq.com/wxa/gettemplatelist?access_token=${accessToken}`,
      {
        method: 'GET',
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch template list: ${response.status} ${response.statusText}`);
    }
    
    // 解析响应数据
    const data = await response.json();
    
    // 检查微信API返回的错误码
    if (data.errcode !== 0) {
      throw new Error(`WeChat API error: ${data.errcode} ${data.errmsg}`);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching template list:', error);
    return NextResponse.json(
      { error: `Failed to fetch template list: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 