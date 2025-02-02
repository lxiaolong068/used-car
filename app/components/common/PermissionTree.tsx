'use client';

import React from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { TreeNode } from '@/types';

interface PermissionTreeProps {
  data: TreeNode[];
  selectedKeys?: number[];
  onSelect?: (keys: number[]) => void;
  checkable?: boolean;
  expandedKeys?: number[];
  onExpand?: (keys: number[]) => void;
  className?: string;
  showIcon?: boolean;
  showPath?: boolean;
  loading?: boolean;
}

export function PermissionTree({
  data,
  selectedKeys = [],
  onSelect,
  checkable = false,
  expandedKeys = [],
  onExpand,
  className = '',
  showIcon = true,
  showPath = false,
  loading = false,
}: PermissionTreeProps) {
  const [expanded, setExpanded] = React.useState<number[]>(expandedKeys);
  const [selected, setSelected] = React.useState<number[]>(selectedKeys);

  React.useEffect(() => {
    setSelected(selectedKeys);
  }, [selectedKeys]);

  React.useEffect(() => {
    setExpanded(expandedKeys);
  }, [expandedKeys]);

  const handleToggle = (nodeId: number) => {
    const newExpanded = expanded.includes(nodeId)
      ? expanded.filter(id => id !== nodeId)
      : [...expanded, nodeId];
    setExpanded(newExpanded);
    onExpand?.(newExpanded);
  };

  const handleSelect = (nodeId: number) => {
    const newSelected = checkable
      ? selected.includes(nodeId)
        ? selected.filter(id => id !== nodeId)
        : [...selected, nodeId]
      : [nodeId];
    setSelected(newSelected);
    onSelect?.(newSelected);
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded.includes(node.id as number);
    const isSelected = selected.includes(node.id as number);

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center py-2 px-2 hover:bg-gray-100 rounded-md cursor-pointer ${
            isSelected ? 'bg-blue-50' : ''
          }`}
          style={{ paddingLeft: `${level * 24 + 8}px` }}
          onClick={() => handleSelect(node.id as number)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggle(node.id as number);
              }}
              className="p-1 hover:bg-gray-200 rounded-md mr-1"
            >
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}
          
          {checkable && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleSelect(node.id as number)}
              className="mr-2"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          
          {showIcon && node.icon && (
            <span className="mr-2">
              <i className={node.icon} />
            </span>
          )}
          
          <span className="flex-1">{node.name}</span>
          
          {showPath && node.path && (
            <span className="text-sm text-gray-500 ml-2">{node.path}</span>
          )}
          
          {node.type && (
            <span className="text-xs text-gray-400 ml-2">{node.type}</span>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      {data.map(node => renderNode(node))}
    </div>
  );
} 