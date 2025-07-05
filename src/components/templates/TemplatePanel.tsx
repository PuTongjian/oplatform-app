import { useState, useEffect } from 'react';
import { DraftItem, TemplateItem, OperationResult } from '@/types/dataTypes';
import DraftList from './DraftList';
import TemplateList from './TemplateList';
import AddTemplateModal from './AddTemplateModal';

interface TemplatePanelProps {
  activeTab: string;
}

export default function TemplatePanel({ activeTab }: TemplatePanelProps) {
  // 状态
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState<boolean>(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [operationLoading, setOperationLoading] = useState<{[key: string]: boolean}>({});
  const [showAddToTemplateModal, setShowAddToTemplateModal] = useState<boolean>(false);
  const [selectedDraftId, setSelectedDraftId] = useState<number | null>(null);
  const [templateType, setTemplateType] = useState<number>(0);
  const [operationResult, setOperationResult] = useState<OperationResult>({ 
    success: false, 
    message: '', 
    visible: false 
  });

  // 获取模板数据
  const fetchTemplateData = async () => {
    if (activeTab !== 'templates') return;
    
    setTemplatesLoading(true);
    setTemplatesError(null);
    
    try {
      // 获取草稿箱列表
      const draftsRes = await fetch('/api/templates/drafts');
      if (draftsRes.ok) {
        const data = await draftsRes.json();
        if (data.draft_list) {
          setDrafts(data.draft_list);
        } else if (data.error) {
          throw new Error(data.error);
        }
      } else {
        throw new Error(`获取草稿箱列表失败: ${draftsRes.status}`);
      }
      
      // 获取模板库列表
      const templatesRes = await fetch('/api/templates/list');
      if (templatesRes.ok) {
        const data = await templatesRes.json();
        if (data.template_list) {
          setTemplates(data.template_list);
        } else if (data.error) {
          throw new Error(data.error);
        }
      } else {
        throw new Error(`获取模板库列表失败: ${templatesRes.status}`);
      }
    } catch (error) {
      console.error('Error fetching template data:', error);
      setTemplatesError(error instanceof Error ? error.message : String(error));
    } finally {
      setTemplatesLoading(false);
    }
  };
  
  // 当切换到模板选项卡时，获取模板数据
  useEffect(() => {
    if (activeTab === 'templates') {
      fetchTemplateData();
    }
  }, [activeTab]);

  // 添加草稿到模板库
  const handleAddToTemplate = async (draftId: number) => {
    setSelectedDraftId(draftId);
    setTemplateType(0); // 默认普通模板
    setShowAddToTemplateModal(true);
  };

  // 确认添加到模板库
  const confirmAddToTemplate = async () => {
    if (selectedDraftId === null) return;
    
    const operationKey = `add-${selectedDraftId}`;
    setOperationLoading({ ...operationLoading, [operationKey]: true });
    
    try {
      const response = await fetch('/api/templates/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          draft_id: selectedDraftId,
          template_type: templateType,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setOperationResult({
          success: true,
          message: data.message || '添加成功',
          visible: true,
        });
        // 重新获取模板数据
        fetchTemplateData();
      } else {
        setOperationResult({
          success: false,
          message: data.error || data.errmsg || '添加失败',
          visible: true,
        });
      }
    } catch (error) {
      setOperationResult({
        success: false,
        message: `添加失败: ${error instanceof Error ? error.message : String(error)}`,
        visible: true,
      });
    } finally {
      setOperationLoading({ ...operationLoading, [operationKey]: false });
      setShowAddToTemplateModal(false);
      // 3秒后隐藏结果提示
      setTimeout(() => {
        setOperationResult(prev => ({ ...prev, visible: false }));
      }, 3000);
    }
  };

  // 删除模板
  const handleDeleteTemplate = async (templateId: number) => {
    if (!confirm('确定要删除此模板吗？此操作不可撤销。')) {
      return;
    }
    
    const operationKey = `delete-${templateId}`;
    setOperationLoading({ ...operationLoading, [operationKey]: true });
    
    try {
      const response = await fetch('/api/templates/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: templateId,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setOperationResult({
          success: true,
          message: data.message || '删除成功',
          visible: true,
        });
        // 重新获取模板数据
        fetchTemplateData();
      } else {
        setOperationResult({
          success: false,
          message: data.error || data.errmsg || '删除失败',
          visible: true,
        });
      }
    } catch (error) {
      setOperationResult({
        success: false,
        message: `删除失败: ${error instanceof Error ? error.message : String(error)}`,
        visible: true,
      });
    } finally {
      setOperationLoading({ ...operationLoading, [operationKey]: false });
      // 3秒后隐藏结果提示
      setTimeout(() => {
        setOperationResult(prev => ({ ...prev, visible: false }));
      }, 3000);
    }
  };

  if (templatesLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="h-8 w-8 rounded-full border-2 border-slate-900/10 dark:border-slate-100/10 border-t-slate-900 dark:border-t-slate-100 animate-spin"></div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">正在获取模板数据...</p>
      </div>
    );
  }

  if (templatesError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <div className="text-red-600 dark:text-red-400 mb-2 font-medium">获取模板数据出错</div>
        <p className="text-red-500 dark:text-red-300">{templatesError}</p>
        {templatesError.includes('ticket') && (
          <>
            <p className="mt-4 text-slate-700 dark:text-slate-300">请先确保已接收到微信推送的component_verify_ticket，或手动录入一个有效的ticket</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              onClick={() => window.location.hash = '#ticket'}
            >
              转到Ticket管理
            </button>
          </>
        )}
        <button 
          className="mt-4 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md ml-4"
          onClick={fetchTemplateData}
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 操作结果提示 */}
      {operationResult.visible && (
        <div className={`p-4 rounded-md ${
          operationResult.success 
            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
            : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
        }`}>
          {operationResult.message}
        </div>
      )}
      
      {/* 添加到模板库的模态框 */}
      <AddTemplateModal 
        isOpen={showAddToTemplateModal}
        onClose={() => setShowAddToTemplateModal(false)}
        onConfirm={confirmAddToTemplate}
        selectedDraftId={selectedDraftId}
        templateType={templateType}
        setTemplateType={setTemplateType}
      />
      
      {/* 草稿箱列表 */}
      <DraftList 
        drafts={drafts} 
        onRefresh={fetchTemplateData}
        onAddToTemplate={handleAddToTemplate}
        operationLoading={operationLoading}
      />
      
      {/* 模板库列表 */}
      <TemplateList 
        templates={templates} 
        onDeleteTemplate={handleDeleteTemplate}
        operationLoading={operationLoading}
      />
    </div>
  );
} 