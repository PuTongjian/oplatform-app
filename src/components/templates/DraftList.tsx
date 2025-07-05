import { DraftItem } from '@/types/dataTypes';

interface DraftListProps {
  drafts: DraftItem[];
  onRefresh: () => void;
  onAddToTemplate: (draftId: number) => void;
  operationLoading: {[key: string]: boolean};
}

export default function DraftList({ drafts, onRefresh, onAddToTemplate, operationLoading }: DraftListProps) {
  // 将时间戳转换为可读格式
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">草稿箱列表</h2>
          <button 
            className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center"
            onClick={onRefresh}
          >
            刷新数据
          </button>
        </div>
        
        {drafts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-3 font-medium">草稿ID</th>
                  <th className="px-4 py-3 font-medium">版本号</th>
                  <th className="px-4 py-3 font-medium">版本描述</th>
                  <th className="px-4 py-3 font-medium">来源小程序</th>
                  <th className="px-4 py-3 font-medium">AppID</th>
                  <th className="px-4 py-3 font-medium">开发者</th>
                  <th className="px-4 py-3 font-medium">创建时间</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {drafts.map((draft) => (
                  <tr key={draft.draft_id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3 font-medium">{draft.draft_id}</td>
                    <td className="px-4 py-3">{draft.user_version}</td>
                    <td className="px-4 py-3">{draft.user_desc}</td>
                    <td className="px-4 py-3">{draft.source_miniprogram}</td>
                    <td className="px-4 py-3 font-mono text-xs">{draft.source_miniprogram_appid}</td>
                    <td className="px-4 py-3">{draft.developer}</td>
                    <td className="px-4 py-3">{formatTime(draft.create_time)}</td>
                    <td className="px-4 py-3">
                      <button
                        className="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded mr-2"
                        onClick={() => onAddToTemplate(draft.draft_id)}
                        disabled={operationLoading[`add-${draft.draft_id}`]}
                      >
                        {operationLoading[`add-${draft.draft_id}`] ? '处理中...' : '添加到模板库'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
            <div className="text-slate-400 dark:text-slate-500">暂无草稿箱数据</div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">请使用微信开发者工具上传草稿</p>
          </div>
        )}
      </div>
    </div>
  );
} 