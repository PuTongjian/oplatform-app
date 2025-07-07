interface TabNavigationProps {
  activeTab: 'ticket' | 'messages' | 'templates' | 'authorization';
  setActiveTab: (tab: 'ticket' | 'messages' | 'templates' | 'authorization') => void;
  messagesCount: number;
}

export default function TabNavigation({ activeTab, setActiveTab, messagesCount }: TabNavigationProps) {
  return (
    <div className="mb-8 border-b border-slate-200 dark:border-slate-800">
      <div className="flex space-x-2">
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === 'ticket'
              ? 'text-slate-900 dark:text-slate-100'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          onClick={() => setActiveTab('ticket')}
        >
          调用凭证
          {activeTab === 'ticket' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 dark:bg-slate-100"></span>
          )}
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors relative flex items-center ${activeTab === 'messages'
              ? 'text-slate-900 dark:text-slate-100'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          onClick={() => setActiveTab('messages')}
        >
          接收的消息
          {messagesCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium">
              {messagesCount}
            </span>
          )}
          {activeTab === 'messages' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 dark:bg-slate-100"></span>
          )}
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors relative flex items-center ${activeTab === 'templates'
              ? 'text-slate-900 dark:text-slate-100'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          onClick={() => setActiveTab('templates')}
        >
          小程序模板库
          {activeTab === 'templates' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 dark:bg-slate-100"></span>
          )}
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors relative flex items-center ${activeTab === 'authorization'
              ? 'text-slate-900 dark:text-slate-100'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          onClick={() => setActiveTab('authorization')}
        >
          小程序授权
          {activeTab === 'authorization' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 dark:bg-slate-100"></span>
          )}
        </button>
      </div>
    </div>
  );
} 