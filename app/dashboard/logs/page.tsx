import { Metadata } from 'next';
import OperationLogs from '@/app/components/features/logs/OperationLogs';

export const metadata: Metadata = {
  title: '操作日志 - 二手车管理系统',
  description: '查看系统操作日志记录',
};

export default function LogsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">操作日志</h1>
        <p className="mt-2 text-sm text-gray-600">
          查看系统中的所有操作记录，包括用户操作、系统变更等信息。
        </p>
      </div>
      <OperationLogs />
    </div>
  );
} 