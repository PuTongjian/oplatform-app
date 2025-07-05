import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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
        {children}
      </div>
      
      <footer className="mt-auto py-6 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
          微信第三方平台接口可视化平台 • {new Date().getFullYear()}
        </div>
      </footer>
    </main>
  );
} 