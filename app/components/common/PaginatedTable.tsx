'use client';

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import type { TableColumn } from '@/types';

interface PaginatedTableProps<T extends Record<string, any>> {
  data: T[];
  columns: TableColumn<T>[];
  pageSize?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  rowKey?: keyof T | ((item: T) => string | number);
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  className?: string;
  emptyText?: string;
  loadingText?: string;
}

export function PaginatedTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  onPageChange,
  loading = false,
  rowKey,
  onSort,
  className = '',
  emptyText = '暂无数据',
  loadingText = '加载中...',
}: PaginatedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; order: 'asc' | 'desc' } | null>(null);
  
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  // 处理排序后的数据
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === bValue) return 0;
      
      const compareResult = aValue < bValue ? -1 : 1;
      return sortConfig.order === 'asc' ? compareResult : -compareResult;
    });
  }, [data, sortConfig]);

  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    const newOrder = sortConfig?.key === key && sortConfig.order === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, order: newOrder });
    onSort?.(key, newOrder);
  };

  const getRowKey = (item: T, index: number): string | number => {
    if (typeof rowKey === 'function') return rowKey(item);
    if (rowKey) return item[rowKey] as string | number;
    return index;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.key}
                  className={`${column.width ? `w-[${column.width}]` : ''} ${column.sortable ? 'cursor-pointer select-none' : ''}`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <span className="text-gray-400">
                        {sortConfig?.key === column.key ? (
                          sortConfig.order === 'asc' ? '↑' : '↓'
                        ) : '↕'}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  {loadingText}
                </TableCell>
              </TableRow>
            ) : currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((item, index) => (
                <TableRow key={getRowKey(item, index)}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.width ? `w-[${column.width}]` : ''}>
                      {column.render ? column.render(item) : item[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-gray-500">
            共 {data.length} 条记录，第 {currentPage}/{totalPages} 页
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded border disabled:opacity-50 text-sm"
            >
              首页
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              上一页
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.min(
                  Math.max(currentPage - 2 + i, 1),
                  totalPages
                );
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded border ${
                      currentPage === pageNum
                        ? 'bg-primary text-white'
                        : ''
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              下一页
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded border disabled:opacity-50 text-sm"
            >
              末页
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 