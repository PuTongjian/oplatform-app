import { useState, useEffect } from 'react';

interface AuthorizedApp {
  authorizer_appid: string;
  refresh_token: string;
  auth_time: number;
}

interface AuthorizedAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedApps: AuthorizedApp[]) => void;
  templateId: number;
}

export default function AuthorizedAppModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  templateId 
}: AuthorizedAppModalProps) {
  const [authorizedApps, setAuthorizedApps] = useState<AuthorizedApp[]>([]);
  const [selectedApps, setSelectedApps] = useState<{[key: string]: boolean}>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      fetchAuthorizedApps();
    }
  }, [isOpen]);

  const fetchAuthorizedApps = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/authorizers/list');
      
      if (!response.ok) {
        throw new Error('获取授权小程序列表失败');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setAuthorizedApps(data.list || []);
      // 重置选择状态
      setSelectedApps({});
    } catch (error) {
      console.error('获取授权小程序列表出错:', error);
      setError('获取授权小程序列表出错: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (appid: string) => {
    setSelectedApps(prev => ({
      ...prev,
      [appid]: !prev[appid]
    }));
  };

  const handleSubmit = () => {
    const selected = authorizedApps.filter(app => selectedApps[app.authorizer_appid]);
    onSubmit(selected);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-semibold">选择需要上传的小程序</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            模板ID: {templateId}
          </p>
        </div>
        
        <div className="p-6 max-h-96 overflow-y-auto">
          {loading && (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {!loading && !error && authorizedApps.length === 0 && (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              暂无授权的小程序
            </div>
          )}
          
          {!loading && authorizedApps.length > 0 && (
            <div className="space-y-2">
              {authorizedApps.map((app) => (
                <div 
                  key={app.authorizer_appid} 
                  className="flex items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg"
                >
                  <input
                    type="checkbox"
                    id={`app-${app.authorizer_appid}`}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    checked={selectedApps[app.authorizer_appid] || false}
                    onChange={() => handleCheckboxChange(app.authorizer_appid)}
                  />
                  <label 
                    htmlFor={`app-${app.authorizer_appid}`}
                    className="ml-3 flex-1 cursor-pointer"
                  >
                    <div className="font-medium">{app.authorizer_appid}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      授权时间: {new Date(app.auth_time * 1000).toLocaleString()}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md"
            onClick={onClose}
          >
            取消
          </button>
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:bg-blue-300 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={loading || Object.values(selectedApps).filter(Boolean).length === 0}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
} 