import { NextResponse } from 'next/server';
import * as credentialsManager from '@/utils/credentialsManager';
import { ensureAccessToken } from '@/utils/accessTokenManager';
import wechatConfig from '@/config/wechatConfig';

// 获取授权商家列表
export async function GET() {
  try {
    // 从credentials.json加载授权商家信息
    const credentials = credentialsManager.loadCredentials();
    const authorizers = credentials.authorizers || {};

    // 获取授权方的详细信息（如名称、头像等）
    const authorizerList = Object.values(authorizers);

    // 确保有第三方平台的access_token
    const componentAccessToken = await ensureAccessToken();

    // 异步获取更多授权方详情
    const updatedAuthorizers: Record<string, any> = {};

    // 对于每个授权方，尝试获取更详细的信息
    for (const authorizer of authorizerList) {
      try {
        // 如果已经有基本信息，先返回它
        updatedAuthorizers[authorizer.appid] = authorizer;

        // 如果没有详细信息，尝试获取
        if (!authorizer.name || !authorizer.principal_name) {
          const detailUrl = `https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_info?access_token=${componentAccessToken}`;
          const detailResponse = await fetch(detailUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              component_appid: wechatConfig.appId,
              authorizer_appid: authorizer.appid
            }),
          });

          const detailData = await detailResponse.json();

          if (!detailData.errcode && detailData.authorizer_info) {
            // 更新授权方信息
            const updatedInfo = {
              ...authorizer,
              name: detailData.authorizer_info.nick_name || detailData.authorizer_info.user_name,
              principal_name: detailData.authorizer_info.principal_name,
              type: detailData.authorizer_info.service_type_info?.id === 2 ? '小程序' : '公众号',
              qrcode_url: detailData.authorizer_info.qrcode_url,
              alias: detailData.authorizer_info.alias
            };

            updatedAuthorizers[authorizer.appid] = updatedInfo;

            // 更新到credentials.json
            if (credentials.authorizers) {
              credentials.authorizers[authorizer.appid] = updatedInfo;
            }
          }
        }
      } catch (error) {
        console.error(`获取授权方 ${authorizer.appid} 详情失败:`, error);
        // 继续处理下一个授权方
      }
    }

    // 保存更新后的授权方信息
    if (Object.keys(updatedAuthorizers).length > 0) {
      if (!credentials.authorizers) {
        credentials.authorizers = {};
      }

      // 合并更新的授权方信息
      Object.assign(credentials.authorizers, updatedAuthorizers);
      credentialsManager.saveCredentials(credentials);
    }

    // 返回授权方列表（按授权时间倒序排列）
    const sortedAuthorizers = Object.values(updatedAuthorizers).sort((a, b) => {
      return new Date(b.authorized_time).getTime() - new Date(a.authorized_time).getTime();
    });

    return NextResponse.json(sortedAuthorizers);

  } catch (error) {
    console.error('获取授权商家列表错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
} 