import { NextResponse } from 'next/server';
import wechatConfig from '@/config/wechatConfig';
import { ensureAccessToken } from '@/utils/accessTokenManager';
import * as credentialsManager from '@/utils/credentialsManager';

// 获取授权方的刷新令牌和授权信息
export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const authorizationCode = requestData.authorization_code;

    if (!authorizationCode) {
      return NextResponse.json(
        { error: '缺少授权码' },
        { status: 400 }
      );
    }

    // 获取第三方平台access_token
    const componentAccessToken = await ensureAccessToken();

    // 调用微信API获取授权方的刷新令牌
    const requestUrl = `https://api.weixin.qq.com/cgi-bin/component/api_query_auth?access_token=${componentAccessToken}`;

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        component_appid: wechatConfig.appId,
        authorization_code: authorizationCode
      }),
    });

    const data = await response.json();

    if (data.errcode) {
      console.error('获取授权方信息失败:', data);
      return NextResponse.json(
        { error: `微信API错误: ${data.errmsg || '未知错误'}` },
        { status: 500 }
      );
    }

    // 从返回数据中提取授权信息
    const authorizationInfo = data.authorization_info;

    if (!authorizationInfo || !authorizationInfo.authorizer_appid) {
      return NextResponse.json(
        { error: '获取授权信息失败，返回数据不完整' },
        { status: 500 }
      );
    }

    // 保存授权方的刷新令牌
    const authorizerAppId = authorizationInfo.authorizer_appid;
    const refreshToken = authorizationInfo.authorizer_refresh_token;

    if (refreshToken) {
      credentialsManager.saveAuthorizerRefreshToken(authorizerAppId, refreshToken);
    }

    // 保存授权方的access_token
    if (authorizationInfo.authorizer_access_token) {
      const tokenData = {
        access_token: authorizationInfo.authorizer_access_token,
        expires_at: Date.now() + (authorizationInfo.expires_in - 600) * 1000 // 设置为比实际过期时间提前10分钟
      };

      credentialsManager.saveAuthorizerAccessToken(authorizerAppId, tokenData);
    }

    // 保存授权方的基本信息
    const authorizerInfo = {
      appid: authorizerAppId,
      refresh_token: refreshToken,
      authorized_time: new Date().toISOString(),
      func_info: authorizationInfo.func_info
    };

    // 保存授权方信息到一个单独的列表中
    const credentials = credentialsManager.loadCredentials();
    if (!credentials.authorizers) {
      credentials.authorizers = {};
    }
    credentials.authorizers[authorizerAppId] = authorizerInfo;
    credentialsManager.saveCredentials(credentials);

    return NextResponse.json(data);

  } catch (error) {
    console.error('获取授权方信息错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
} 