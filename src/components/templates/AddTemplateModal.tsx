
interface AddTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedDraftId: number | null;
  templateType: number;
  setTemplateType: (type: number) => void;
}

export default function AddTemplateModal({
  isOpen,
  onClose,
  onConfirm,
  templateType,
  setTemplateType
}: AddTemplateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">添加到模板库</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          请选择要添加的模板类型：
        </p>
        <div className="flex flex-col gap-3 mb-6">
          <label className="flex items-center">
            <input 
              type="radio" 
              name="templateType" 
              value="0"
              checked={templateType === 0} 
              onChange={() => setTemplateType(0)}
              className="mr-2"
            />
            <span>普通模板</span>
          </label>
          <label className="flex items-center">
            <input 
              type="radio" 
              name="templateType" 
              value="1"
              checked={templateType === 1} 
              onChange={() => setTemplateType(1)}
              className="mr-2"
            />
            <span>标准模板</span>
          </label>
        </div>
        <div className="flex justify-end gap-3">
          <button 
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded"
            onClick={onClose}
          >
            取消
          </button>
          <button 
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            onClick={onConfirm}
          >
            确认添加
          </button>
        </div>
      </div>
    </div>
  );
} 