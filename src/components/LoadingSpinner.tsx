interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = '正在加载...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="h-8 w-8 rounded-full border-2 border-slate-900/10 dark:border-slate-100/10 border-t-slate-900 dark:border-t-slate-100 animate-spin"></div>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{message}</p>
    </div>
  );
} 