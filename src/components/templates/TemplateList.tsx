import { useState } from 'react';
import { TemplateItem } from '@/types/dataTypes';
import AuditStatusBadge from './AuditStatusBadge';
import AuthorizedAppModal from './AuthorizedAppModal';

interface AuthorizedApp {
  authorizer_appid: string;
  refresh_token: string;
  auth_time: number;
}

interface TemplateListProps {
  templates: TemplateItem[];
  onDeleteTemplate: (templateId: number) => void;
  operationLoading: {[key: string]: boolean};
  onUploadTemplate?: (templateId: number, authorizedApps: AuthorizedApp[]) => void;
}

export default function TemplateList({ 
  templates, 
  onDeleteTemplate, 
  operationLoading,
  onUploadTemplate
}: TemplateListProps) {
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

  // 将时间戳转换为可读格式
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // 处理点击上传按钮
  const handleUploadClick = (templateId: number) => {
    setSelectedTemplateId(templateId);
    setShowAuthModal(true);
  };

  // 处理提交选中的授权小程序
  const handleAuthSubmit = (selectedApps: AuthorizedApp[]) => {
    if (selectedTemplateId !== null && onUploadTemplate) {
      onUploadTemplate(selectedTemplateId, selectedApps);
    }
    setShowAuthModal(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">模板库列表</h2>
        
        {templates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-3 font-medium">模板ID</th>
                  <th className="px-4 py-3 font-medium">版本号</th>
                  <th className="px-4 py-3 font-medium">版本描述</th>
                  <th className="px-4 py-3 font-medium">来源小程序</th>
                  <th className="px-4 py-3 font-medium">类型</th>
                  <th className="px-4 py-3 font-medium">审核状态</th>
                  <th className="px-4 py-3 font-medium">创建时间</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template) => (
                  <tr key={template.template_id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3 font-medium">{template.template_id}</td>
                    <td className="px-4 py-3">{template.user_version}</td>
                    <td className="px-4 py-3">{template.user_desc}</td>
                    <td className="px-4 py-3">{template.source_miniprogram}</td>
                    <td className="px-4 py-3">
                      {template.template_type === 0 ? (
                        <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">普通模板</span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">标准模板</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {template.audit_status !== undefined ? (
                        <AuditStatusBadge status={template.audit_status} />
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{formatTime(template.create_time)}</td>
                    <td className="px-4 py-3 flex space-x-2">
                      <button
                        className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
                        onClick={() => handleUploadClick(template.template_id)}
                        disabled={operationLoading[`upload-${template.template_id}`]}
                      >
                        {operationLoading[`upload-${template.template_id}`] ? '上传中...' : '上传'}
                      </button>
                      <button
                        className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                        onClick={() => onDeleteTemplate(template.template_id)}
                        disabled={operationLoading[`delete-${template.template_id}`]}
                      >
                        {operationLoading[`delete-${template.template_id}`] ? '处理中...' : '删除'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
            <div className="text-slate-400 dark:text-slate-500">暂无模板库数据</div>
          </div>
        )}
      </div>

      {/* 授权小程序选择模态框 */}
      {selectedTemplateId && (
        <AuthorizedAppModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onSubmit={handleAuthSubmit}
          templateId={selectedTemplateId}
        />
      )}
    </div>
  );
} 