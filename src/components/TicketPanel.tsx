import { useState } from 'react';
import { TicketData } from '@/types/dataTypes';

interface TicketPanelProps {
  ticketData: TicketData | null;
  onSaveTicket: (data: any) => Promise<void>;
}

export default function TicketPanel({ ticketData, onSaveTicket }: TicketPanelProps) {
  const [accessToken, setAccessToken] = useState<string>('');
  const [tokenLoading, setTokenLoading] = useState<boolean>(false);
  const [xmlInput, setXmlInput] = useState<string>('');
  const [xmlError, setXmlError] = useState<string>('');
  const [showXmlInput, setShowXmlInput] = useState<boolean>(false);
  const [savingTicket, setSavingTicket] = useState<boolean>(false);

  // 获取当前access_token（通过后端API）
  const fetchAccessToken = async () => {
    try {
      setTokenLoading(true);
      
      // 调用服务端API获取token
      const response = await fetch('/api/token');
      
      if (!response.ok) {
        throw new Error('Failed to fetch token from server');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setAccessToken(data.access_token);
    } catch (error) {
      console.error('Failed to fetch access token:', error);
    } finally {
      setTokenLoading(false);
    }
  };

  // 保存手动输入的Ticket
  const saveTicket = async () => {
    try {
      setSavingTicket(true);
      setXmlError('');

      if (!xmlInput.trim()) {
        setXmlError('请输入JSON数据');
        return;
      }

      // 尝试解析JSON数据
      let data;
      try {
        data = JSON.parse(xmlInput);
      } catch {
        setXmlError('JSON格式不正确');
        return;
      }

      // 调用父组件的保存方法
      await onSaveTicket(data);
      
      // 清空输入框并隐藏
      setXmlInput('');
      setShowXmlInput(false);
      
    } catch (error) {
      console.error('Error saving ticket:', error);
      setXmlError('保存失败：' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setSavingTicket(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">调用凭证</h2>
          <button 
            className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center"
            onClick={() => setShowXmlInput(!showXmlInput)}
          >
            {showXmlInput ? '取消录入' : '手动录入Ticket'}
          </button>
        </div>
        
        {/* 手动录入表单 */}
        {showXmlInput && (
          <div className="mb-6 bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <h3 className="text-md font-medium mb-3">手动录入Ticket JSON数据</h3>
            <textarea
              className="w-full h-40 p-3 text-sm font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md"
              placeholder={`{
  "xml": {
    "AppId": [
      "wx4359ea3228e0f1c3"
    ],
    "CreateTime": [
      "1751618770"
    ],
    "InfoType": [
      "component_verify_ticket"
    ],
    "ComponentVerifyTicket": [
      "ticket@@@..."
    ]
  }
}`}
              value={xmlInput}
              onChange={(e) => setXmlInput(e.target.value)}
            />
            {xmlError && <p className="mt-2 text-sm text-red-500">{xmlError}</p>}
            <button
              className={`mt-3 px-4 py-2 rounded-md ${
                savingTicket 
                  ? 'bg-slate-400 cursor-not-allowed text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
              onClick={saveTicket}
              disabled={savingTicket}
            >
              {savingTicket ? '保存中...' : '保存到缓存'}
            </button>
          </div>
        )}
        
        {ticketData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Verify Ticket</div>
                <div className="font-mono text-xs bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 break-all">
                  {ticketData.ticket}
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">AppID</div>
                <div className="font-mono text-xs bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                  {ticketData.appId}
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">创建时间</div>
                <div className="text-slate-900 dark:text-slate-100">
                  {new Date(parseInt(ticketData.createTime) * 1000).toLocaleString()}
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">接收时间</div>
                <div className="text-slate-900 dark:text-slate-100">
                  {new Date(ticketData.receivedAt).toLocaleString()}
                </div>
              </div>
            </div>
            
            {/* Access Token 区域 */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Access Token</div>
                <button 
                  className={`px-3 py-1 text-xs rounded-full 
                    ${tokenLoading ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                  onClick={fetchAccessToken}
                  disabled={tokenLoading}
                >
                  {tokenLoading ? '获取中...' : '获取/刷新'}
                </button>
              </div>
              {accessToken ? (
                <div className="relative">
                  <div className="font-mono text-xs bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 break-all overflow-x-auto">
                    {accessToken}
                  </div>
                  <button
                    className="absolute top-2 right-2 p-1 text-xs rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                    onClick={() => navigator.clipboard.writeText(accessToken)}
                    title="复制到剪贴板"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="text-sm text-slate-500 dark:text-slate-400 italic">
                  {tokenLoading ? 
                    "获取中..." : 
                    "点击上方按钮获取当前access_token"}
                </div>
              )}
            </div>
            
            {ticketData.raw && (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">原始数据</div>
                <pre className="font-mono text-xs bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 overflow-x-auto">
                  {JSON.stringify(ticketData.raw, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
            <div className="text-slate-400 dark:text-slate-500">暂无 Ticket 数据</div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">请使用&quot手动录入Ticket&quot按钮手动添加</p>
          </div>
        )}
      </div>
    </div>
  );
} 