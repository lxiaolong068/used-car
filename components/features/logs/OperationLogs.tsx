'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import useSWR from 'swr';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface OperationLog {
  log_id: number;
  user_id: number;
  action_type: string;
  details: string | null;
  ip_address: string | null;
  create_time: string;
  username?: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('加载日志数据失败');
    error.message = await res.text();
    throw error;
  }
  return res.json();
};

export default function OperationLogs() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log('OperationLogs - Unauthenticated, redirecting to login...');
    }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [actionType, setActionType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  console.log('OperationLogs - Session Status:', status);
  console.log('OperationLogs - Session Data:', session);

  if (status === 'loading') {
    console.log('OperationLogs - Loading session...');
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    console.log('OperationLogs - No user in session');
    return (
      <div className="text-center text-red-500 py-4">
        请先登录后再访问此页面
      </div>
    );
  }

  console.log('OperationLogs - User is authenticated:', session.user);

  const { data, error, isLoading } = useSWR<{
    logs: OperationLog[];
    total: number;
  }>(
    session ? `/api/logs?page=${currentPage}&pageSize=${pageSize}&search=${searchTerm}&actionType=${actionType}` : null,
    fetcher
  );

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  const actionTypes = [
    { value: 'all', label: '所有操作' },
    { value: 'create', label: '创建' },
    { value: 'update', label: '更新' },
    { value: 'delete', label: '删除' },
    { value: 'login', label: '登录' },
    { value: 'logout', label: '登出' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleActionTypeChange = (value: string) => {
    setActionType(value);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        加载失败: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-4 items-end">
        <div className="flex-1 max-w-sm">
          <Input
            type="text"
            placeholder="搜索操作详情..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={actionType} onValueChange={handleActionTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择操作类型" />
          </SelectTrigger>
          <SelectContent>
            {actionTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit">搜索</Button>
      </form>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>用户</TableHead>
              <TableHead>操作类型</TableHead>
              <TableHead>操作详情</TableHead>
              <TableHead>IP地址</TableHead>
              <TableHead>操作时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : data?.logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  暂无日志记录
                </TableCell>
              </TableRow>
            ) : (
              data?.logs.map((log) => (
                <TableRow key={log.log_id}>
                  <TableCell>{log.log_id}</TableCell>
                  <TableCell>{log.username || log.user_id}</TableCell>
                  <TableCell>{log.action_type}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {log.details || '-'}
                  </TableCell>
                  <TableCell>{log.ip_address || '-'}</TableCell>
                  <TableCell>
                    {format(new Date(log.create_time), 'yyyy-MM-dd HH:mm:ss')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            上一页
          </Button>
          <span className="py-2 px-4">
            第 {currentPage} 页，共 {totalPages} 页
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  );
} 