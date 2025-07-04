'use client';

import { useEffect, useState } from 'react';

// 定义数据类型
interface TicketData {
  ticket: string;
  appId: string;
  createTime: string;
  receivedAt: string;
  raw?: any;
}

interface MessageData {
  receivedAt: string;
  params: {
    signature?: string;
    timestamp?: string;
    nonce?: string;
    openid?: string;
    encryptType?: string;
    msgSignature?: string;
  };
  rawData: string;
  parsedData: any;
  decryptedData?: any;
  isEncrypted?: boolean;
  signatureValid?: boolean;
}

export default function Home() {
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'ticket' | 'messages'>('ticket');

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 获取Ticket数据
        const ticketRes = await fetch('/api/data/ticket');
        if (ticketRes.ok) {
          const ticket = await ticketRes.json();
          setTicketData(ticket);
        }

        // 获取消息数据
        const messagesRes = await fetch('/api/data/messages');
        if (messagesRes.ok) {
          const msgs = await messagesRes.json();
          setMessages(msgs);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // 设置定时刷新，每30秒刷新一次
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      {/* 头部导航 */}
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">微信第三方平台接口可视化平台</h1>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">实时更新中</span>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        {/* 选项卡导航 */}
        <div className="mb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'ticket' 
                  ? 'text-slate-900 dark:text-slate-100' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
              onClick={() => setActiveTab('ticket')}
            >
              Verify Ticket
              {activeTab === 'ticket' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 dark:bg-slate-100"></span>
              )}
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium transition-colors relative flex items-center ${
                activeTab === 'messages' 
                  ? 'text-slate-900 dark:text-slate-100' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
              onClick={() => setActiveTab('messages')}
            >
              接收的消息
              {messages.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                  {messages.length}
                </span>
              )}
              {activeTab === 'messages' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 dark:bg-slate-100"></span>
              )}
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="h-8 w-8 rounded-full border-2 border-slate-900/10 dark:border-slate-100/10 border-t-slate-900 dark:border-t-slate-100 animate-spin"></div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">正在获取数据...</p>
          </div>
        ) : (
          <>
            {/* Ticket内容 */}
            {activeTab === 'ticket' && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Component Verify Ticket</h2>
                  {ticketData ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                          <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Ticket</div>
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
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">等待微信服务器推送</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* 消息内容 */}
            {activeTab === 'messages' && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">接收的消息</h2>
                  {messages.length > 0 ? (
                    <div className="space-y-8">
                      {messages.map((msg, index) => (
                        <div key={index} className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                          <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-medium mr-2">
                                {messages.length - index}
                              </span>
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                消息 #{messages.length - index}
                              </span>
                              {msg.isEncrypted && (
                                <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  加密消息
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(msg.receivedAt).toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="p-4 space-y-4">
                            {/* 加密状态信息 */}
                            {msg.isEncrypted && (
                              <div className="flex flex-wrap gap-2">
                                <div className={`flex items-center px-2 py-1 rounded text-xs ${
                                  msg.signatureValid === true 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                    : msg.signatureValid === false
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                }`}>
                                  {msg.signatureValid === true 
                                    ? (
                                      <>
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        签名验证通过
                                      </>
                                    ) 
                                    : msg.signatureValid === false
                                    ? (
                                      <>
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        签名验证失败
                                      </>
                                    ) 
                                    : (
                                      <>
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                        </svg>
                                        未验证签名
                                      </>
                                    )
                                  }
                                </div>
                                <div className="flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                  </svg>
                                  {msg.decryptedData ? '解密成功' : '解密失败'}
                                </div>
                              </div>
                            )}

                            <div>
                              <div className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">参数信息</div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {Object.entries(msg.params).map(([key, value]) => value && (
                                  <div key={key} className="flex bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-2">{key}:</span>
                                    <span className="text-xs truncate">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">原始数据</div>
                                <button 
                                  className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                                  onClick={() => {navigator.clipboard.writeText(msg.rawData)}}
                                >
                                  复制
                                </button>
                              </div>
                              <div className="relative">
                                <pre className="font-mono text-xs bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 overflow-x-auto max-h-48">
                                  {msg.rawData}
                                </pre>
                                <div className="absolute bottom-0 right-0 left-0 h-8 bg-gradient-to-t from-white dark:from-slate-800 to-transparent pointer-events-none"></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">解析后数据</div>
                                <button 
                                  className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                                  onClick={() => {navigator.clipboard.writeText(JSON.stringify(msg.parsedData, null, 2))}}
                                >
                                  复制
                                </button>
                              </div>
                              <div className="relative">
                                <pre className="font-mono text-xs bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 overflow-x-auto max-h-48">
                                  {JSON.stringify(msg.parsedData, null, 2)}
                                </pre>
                                <div className="absolute bottom-0 right-0 left-0 h-8 bg-gradient-to-t from-white dark:from-slate-800 to-transparent pointer-events-none"></div>
                              </div>
                            </div>
                            
                            {msg.decryptedData && (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">解密后数据</div>
                                  <button 
                                    className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                                    onClick={() => {navigator.clipboard.writeText(JSON.stringify(msg.decryptedData, null, 2))}}
                                  >
                                    复制
                                  </button>
                                </div>
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-md p-2 mb-2 flex items-center">
                                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 text-emerald-500">
                                    <path d="M8 1.33333C4.32 1.33333 1.33334 4.32 1.33334 8C1.33334 11.68 4.32 14.6667 8 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8C14.6667 4.32 11.68 1.33333 8 1.33333ZM6.66667 11.3333L3.33334 8L4.27334 7.06L6.66667 9.44667L11.7267 4.38667L12.6667 5.33333L6.66667 11.3333Z" fill="currentColor"/>
                                  </svg>
                                  <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">已成功解密</span>
                                </div>
                                <div className="relative">
                                  <pre className="font-mono text-xs bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 overflow-x-auto max-h-48">
                                    {JSON.stringify(msg.decryptedData, null, 2)}
                                  </pre>
                                  <div className="absolute bottom-0 right-0 left-0 h-8 bg-gradient-to-t from-white dark:from-slate-800 to-transparent pointer-events-none"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                      <div className="text-slate-400 dark:text-slate-500">暂无消息数据</div>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">等待微信服务器推送</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <footer className="mt-auto py-6 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
          微信第三方平台接口可视化平台 • {new Date().getFullYear()}
        </div>
      </footer>
    </main>
  );
}
