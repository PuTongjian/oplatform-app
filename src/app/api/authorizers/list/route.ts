import { NextResponse } from 'next/server';
import { ensureAccessToken } from '@/utils/accessTokenManager';
import wechatConfig from '@/config/wechatConfig';

export async function GET() {
  try {
    // 获取平台access token
    const token = await ensureAccessToken();
    
    if (!token) {
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
    }
    
    // 调用微信API获取授权小程序列表
    const requestUrl = `https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_list?access_token=${token}`;
    
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        component_appid: wechatConfig.appId,
        offset: 0,
        count: 500 // 最大值
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`微信API错误: ${errorData.errmsg || '未知错误'}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('获取授权小程序列表出错:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
} 