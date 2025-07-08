import { NextResponse } from 'next/server';
import { ensureAccessToken, refreshAccessToken, getTokenInfo } from '@/utils/accessTokenManager';

// 获取access token的API端点
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get('refresh') === 'true';

    // 根据是否需要强制刷新来获取token
    const token = refresh
      ? await refreshAccessToken()
      : await ensureAccessToken();

    // 获取token的详细信息（包括过期时间等）
    const tokenInfo = getTokenInfo();

    return NextResponse.json({
      ...tokenInfo,
      access_token: token
    });
  } catch (error) {
    console.error('Failed to get access token:', error);
    return NextResponse.json(
      { error: `Failed to get access token: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
} 