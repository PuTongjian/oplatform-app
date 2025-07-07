import { useState, useEffect } from 'react';

interface AuthorizationPanelProps {
  activeTab: string;
}

export default function AuthorizationPanel({ activeTab }: AuthorizationPanelProps) {
  const [preAuthCode, setPreAuthCode] = useState<string>('');
  const [expiresIn, setExpiresIn] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState<string>('');
  const [componentAppId, setComponentAppId] = useState<string>('');
  const [host, setHost] = useState<string>('');

  // 获取当前主机地址
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHost(window.location.origin);
    }
  }, []);

  // 获取预授权码
  const fetchPreAuthCode = async () => {
    if (activeTab !== 'authorization') return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pre_auth_code');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '获取预授权码失败');
      }

      const data = await response.json();

      if (data.pre_auth_code) {
        setPreAuthCode(data.pre_auth_code);
        setExpiresIn(data.expires_in);
        setComponentAppId(data.component_appid);

        // 自动生成授权URL
        if (host) {
          generateAuthUrl(data.pre_auth_code, data.component_appid);
        }
      } else {
        throw new Error('获取预授权码失败，返回数据格式不正确');
      }
    } catch (error) {
      console.error('Error fetching pre_auth_code:', error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  // 当切换到授权选项卡或重置预授权码时，获取新的预授权码
  useEffect(() => {
    if (activeTab === 'authorization' && host) {
      fetchPreAuthCode();
    }
  }, [activeTab, host]);

  // 生成授权URL
  const generateAuthUrl = (code = preAuthCode, appid = componentAppId) => {
    if (!code || !appid || !host) return;

    // 回调URI为当前应用的callback路径
    const callbackUri = `${host}/api/authorization/callback`;

    // 构建PC版授权链接
    // auth_type=2 表示仅展示小程序
    const url = `https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=${appid}&pre_auth_code=${code}&redirect_uri=${encodeURIComponent(callbackUri)}&auth_type=2`;
    setAuthUrl(url);
  };

  // 复制URL到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('已复制到剪贴板');
    } catch (err) {
      console.error('复制失败', err);
    }
  };

  // 打开授权页面
  const openAuthPage = () => {
    if (authUrl) {
      // 使用window.open并设置特定参数，确保传递referrer信息
      window.open(authUrl, '_blank', 'noreferrer=no');
    }
  };

  return (
    <div className="space-y-8">
      {/* 错误信息显示 */}
      {error && (
        <div className="p-4 rounded-md bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300">
          {error}
        </div>
      )}

      {/* 预授权码部分 */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">获取预授权码</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              预授权码 (pre_auth_code)
            </span>
            <button
              onClick={fetchPreAuthCode}
              disabled={loading}
              className={`px-3 py-1 rounded-md text-sm ${loading
                ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
            >
              {loading ? '获取中...' : '刷新'}
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded p-3 border border-slate-200 dark:border-slate-700">
            <div className="font-mono text-sm break-all">
              {preAuthCode || (loading ? '获取中...' : '点击上方按钮获取预授权码')}
            </div>
            {preAuthCode && (
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                有效期: {expiresIn} 秒
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              授权回调 URI (redirect_uri)
            </label>
            <div className="bg-slate-50 dark:bg-slate-900 rounded p-3 border border-slate-200 dark:border-slate-700">
              <div className="font-mono text-sm break-all">
                {host ? `${host}/api/authorization/callback` : '加载中...'}
              </div>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              授权完成后，将会跳转到此地址并带上授权码
            </p>
          </div>
        </div>
      </div>

      {/* 授权链接部分 */}
      {authUrl && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">PC端授权链接</h2>

          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-900 rounded p-3 border border-slate-200 dark:border-slate-700 relative">
              <div className="font-mono text-sm break-all pr-8">
                {authUrl}
              </div>
              <button
                onClick={() => copyToClipboard(authUrl)}
                className="absolute top-3 right-3 p-1 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                title="复制到剪贴板"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            <div className="flex justify-center">
              <button
                onClick={openAuthPage}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer"
              >
                打开授权页面
              </button>
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/30 rounded text-sm text-yellow-800 dark:text-yellow-300">
              <p>
                <strong>使用说明：</strong>
              </p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>点击上方按钮打开授权页面</li>
                <li>微信扫描页面上的二维码</li>
                <li>在手机上选择要授权的小程序账号</li>
                <li>确认授权后，将会跳转到回调页面并显示授权码</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 