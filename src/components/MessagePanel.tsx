import { MessageData } from '@/types/dataTypes';

interface MessagePanelProps {
  messages: MessageData[];
}

export default function MessagePanel({ messages }: MessagePanelProps) {
  return (
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
                    {msg.appid && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        {msg.appid}
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
  );
} 