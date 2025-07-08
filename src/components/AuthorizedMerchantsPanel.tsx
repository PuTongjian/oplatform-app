'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';

interface AuthorizerInfo {
  appid: string;
  refresh_token: string;
  authorized_time: string;
  name?: string;
  type?: string;
  principal_name?: string;
  alias?: string;
  qrcode_url?: string;
  func_info?: any[];
}

export default function AuthorizedMerchantsPanel() {
  const [merchants, setMerchants] = useState<AuthorizerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取授权商家列表
  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const response = await fetch('/api/authorization/merchants');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '获取授权商家失败');
        }

        const data = await response.json();
        setMerchants(data);
      } catch (error) {
        console.error('获取授权商家错误:', error);
        setError(error instanceof Error ? error.message : '未知错误');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchants();
  }, []);

  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
        <span className="ml-2">加载授权商家...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded">
        <p className="text-red-700 dark:text-red-300">获取授权商家失败: {error}</p>
      </div>
    );
  }

  if (merchants.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">没有授权商家</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">目前还没有商家授权给您的第三方平台。</p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">已授权商家 ({merchants.length})</h2>
        <Link
          href="/"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
        >
          返回首页
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {merchants.map((merchant) => (
          <div
            key={merchant.appid}
            className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex flex-col"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-12 h-12 relative overflow-hidden rounded-md">
                {merchant.qrcode_url ? (
                  <Image
                    src={merchant.qrcode_url}
                    alt={merchant.name || merchant.appid}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium truncate">
                  {merchant.name || merchant.alias || '未知名称'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {merchant.type || '未知类型'} | AppID: {merchant.appid.substring(0, 10)}...
                </p>
                {merchant.principal_name && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    主体: {merchant.principal_name}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${merchant.type === '小程序'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                  {merchant.type || '未知类型'}
                </span>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <p>授权时间: {formatDate(merchant.authorized_time)}</p>
              <p className="mt-1">
                已授权权限: {merchant.func_info?.length || 0} 项
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 