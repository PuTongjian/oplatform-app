import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 从请求URL中获取参数
  const { searchParams } = new URL(request.url);
  const authCode = searchParams.get('auth_code');
  const expiresIn = searchParams.get('expires_in');

  // 简单记录授权回调
  console.log('Received authorization callback:', { authCode, expiresIn });

  // 重定向到可视化页面，将参数传递过去
  return NextResponse.redirect(
    `http://malphite.ddns.net:33333/authorization/callback?auth_code=${authCode}&expires_in=${expiresIn}`
  );
} 