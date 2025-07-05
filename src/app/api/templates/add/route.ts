import { NextResponse } from 'next/server';
import { ensureAccessToken } from '@/utils/accessTokenManager';

// 将草稿添加到模板库的API端点
export async function POST(request: Request) {
  try {
    // 解析请求参数
    const body = await request.json();
    const { draft_id, template_type } = body;

    // 检查draft_id是否存在且为数字（包括0）
    if (draft_id === undefined || draft_id === null || typeof draft_id !== 'number') {
      return NextResponse.json(
        { error: '缺少必要参数：draft_id或参数类型错误' },
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

    // 构建请求参数
    const requestData: any = { draft_id };
    if (template_type !== undefined) {
      requestData.template_type = template_type;
    }

    // 调用微信API将草稿添加到模板库
    const response = await fetch(
      `https://api.weixin.qq.com/wxa/addtotemplate?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error(`添加到模板库失败: ${response.status} ${response.statusText}`);
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
      message: '已成功添加到模板库'
    });
  } catch (error) {
    console.error('添加到模板库失败:', error);
    return NextResponse.json(
      { error: `添加到模板库失败: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 