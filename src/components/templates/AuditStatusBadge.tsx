interface AuditStatusBadgeProps {
  status: number;
}

export default function AuditStatusBadge({ status }: AuditStatusBadgeProps) {
  let color, text;
  
  switch (status) {
    case 0:
      color = "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      text = "未提审核";
      break;
    case 1:
      color = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      text = "审核中";
      break;
    case 2:
      color = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      text = "审核驳回";
      break;
    case 3:
      color = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      text = "审核通过";
      break;
    case 4:
      color = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      text = "提审中";
      break;
    case 5:
      color = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      text = "提审失败";
      break;
    default:
      color = "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      text = "未知状态";
  }
  
  return (
    <span className={`px-2 py-1 text-xs rounded ${color}`}>
      {text}
    </span>
  );
} 