'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

// 创建一个包含 useSearchParams 的组件
function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const authCode = searchParams.get('auth_code');
  const expiresIn = searchParams.get('expires_in');
  const [copySuccess, setCopySuccess] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 调用API获取授权方的信息和刷新令牌
  useEffect(() => {
    const fetchAuthorizerToken = async () => {
      if (!authCode) return;

      setIsLoading(true);
      try {
        // 调用后端API获取刷新令牌
        const response = await fetch('/api/authorization/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ authorization_code: authCode }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '获取授权信息失败');
        }

        setApiResponse(data);
      } catch (error) {
        console.error('获取授权信息错误:', error);
        setApiError(error instanceof Error ? error.message : '未知错误');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorizerToken();
  }, [authCode]);

  // 复制授权码到剪贴板
  const copyAuthCode = async () => {
    if (authCode) {
      try {
        await navigator.clipboard.writeText(authCode);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('复制失败:', err);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Link
          href="/"
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          返回首页
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">授权完成</h1>

        {authCode ? (
          <>
            <div className="p-4 mb-6 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded">
              <p className="flex items-center text-green-800 dark:text-green-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                授权成功！已获取授权码
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-2">授权码 (auth_code)</h2>
                <div className="relative">
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700 font-mono text-sm break-all">
                    {authCode}
                  </div>
                  <button
                    onClick={copyAuthCode}
                    className="absolute top-2 right-2 p-1.5 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                    title="复制授权码"
                  >
                    {copySuccess ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
                {expiresIn && (
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    有效期: {expiresIn} 秒
                  </p>
                )}
              </div>

              {isLoading && (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-slate-600 dark:text-slate-300">获取授权信息中...</span>
                </div>
              )}

              {apiError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded">
                  <p className="text-red-700 dark:text-red-300">获取授权信息失败: {apiError}</p>
                </div>
              )}

              {apiResponse && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">授权信息已保存</h3>
                  <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <p>授权方AppID: {apiResponse.authorization_info?.authorizer_appid}</p>
                    <p>已获取刷新令牌，您可以代表该账号调用接口</p>
                    <p>
                      授权权限: {apiResponse.authorization_info?.func_info?.length || 0} 项
                    </p>
                  </div>
                </div>
              )}

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">下一步操作</h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  您可以在<Link href="/authorized-merchants" className="underline">授权商家</Link>页面查看所有已授权的商家信息。
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded text-red-800 dark:text-red-300">
            未接收到授权码。请确保授权流程正确完成。
          </div>
        )}
      </div>
    </div>
  );
}

// 主页面组件，使用 Suspense 包装 useSearchParams 的使用
export default function AuthorizationCallbackPage() {
  return (
    <Layout>
      <Suspense fallback={<div className="text-center py-10">加载授权信息中...</div>}>
        <AuthCallbackContent />
      </Suspense>
    </Layout>
  );
} 