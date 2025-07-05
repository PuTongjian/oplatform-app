import { NextResponse } from 'next/server';
import { ensureAccessToken } from '@/utils/accessTokenManager';

// 删除模板的API端点
export async function POST(request: Request) {
  try {
    // 解析请求参数
    const body = await request.json();
    const { template_id } = body;

    // 检查template_id是否存在且为数字（包括0）
    if (template_id === undefined || template_id === null || typeof template_id !== 'number') {
      return NextResponse.json(
        { error: '缺少必要参数：template_id或参数类型错误' },
        { status: 400 }
      );
    }

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

    // 调用微信API删除模板
    const response = await fetch(
      `https://api.weixin.qq.com/wxa/deletetemplate?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ template_id }),
      }
    );

    if (!response.ok) {
      throw new Error(`删除模板失败: ${response.status} ${response.statusText}`);
    }

    // 解析响应数据
    const data = await response.json();

    // 检查微信API返回的错误码
    if (data.errcode !== 0) {
      return NextResponse.json(
        { 
          success: false,
          errcode: data.errcode,
          errmsg: data.errmsg 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '已成功删除模板'
    });
  } catch (error) {
    console.error('删除模板失败:', error);
    return NextResponse.json(
      { error: `删除模板失败: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 