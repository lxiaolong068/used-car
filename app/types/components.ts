import { ReactNode } from 'react';
import type { TableColumn, TreeNode } from './index';

// PaginatedTable组件类型
export interface PaginatedTableProps<T extends Record<string, any>> {
  data: T[];
  columns: TableColumn<T>[];
  pageSize?: number;
  currentPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  rowKey?: keyof T | ((item: T) => string | number);
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  defaultSortKey?: string;
  defaultSortOrder?: 'asc' | 'desc';
  className?: string;
  emptyText?: string;
  loadingText?: string;
  rowClassName?: string | ((item: T) => string);
  onRowClick?: (item: T) => void;
  selectedRows?: T[];
  onSelectRows?: (rows: T[]) => void;
}

// FormModal组件类型
export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit?: () => void | Promise<void>;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
  closeOnOverlayClick?: boolean;
  preventCloseOnLoading?: boolean;
  className?: string;
  bodyClassName?: string;
  footerClassName?: string;
  hideFooter?: boolean;
  beforeClose?: () => boolean | Promise<boolean>;
  afterClose?: () => void;
  closeOnEsc?: boolean;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
}

// PermissionTree组件类型
export interface PermissionTreeProps {
  data: TreeNode[];
  selectedKeys?: (number | string)[];
  onSelect?: (keys: (number | string)[]) => void;
  checkable?: boolean;
  expandedKeys?: (number | string)[];
  onExpand?: (keys: (number | string)[]) => void;
  className?: string;
  showIcon?: boolean;
  showPath?: boolean;
  loading?: boolean;
  draggable?: boolean;
  onDrop?: (info: {
    dragNode: TreeNode;
    dropNode: TreeNode;
    dropPosition: number;
  }) => void;
  filterTreeNode?: (node: TreeNode) => boolean;
  loadData?: (node: TreeNode) => Promise<void>;
  titleRender?: (node: TreeNode) => ReactNode;
  height?: number;
  virtual?: boolean;
  motion?: boolean;
  blockNode?: boolean;
}

// Table基础组件类型
export interface TableProps<T> extends React.HTMLAttributes<HTMLTableElement> {
  data?: T[];
  columns?: TableColumn<T>[];
  loading?: boolean;
  bordered?: boolean;
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  striped?: boolean;
  compact?: boolean;
  scrollX?: boolean | number;
  scrollY?: boolean | number;
  fixedHeader?: boolean;
  fixedColumns?: boolean;
  emptyText?: ReactNode;
  caption?: ReactNode;
  footer?: ReactNode;
  summary?: ReactNode;
}

// 表格单元格类型
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  colSpan?: number;
  rowSpan?: number;
  ellipsis?: boolean;
  width?: number | string;
  fixed?: 'left' | 'right';
}

// 表格头部单元格类型
export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  align?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  colSpan?: number;
  rowSpan?: number;
  width?: number | string;
  fixed?: 'left' | 'right';
  sortable?: boolean;
  sortOrder?: 'asc' | 'desc' | null;
  onSort?: (order: 'asc' | 'desc') => void;
  filterDropdown?: ReactNode;
  filtered?: boolean;
  onFilter?: (value: any) => void;
}

// 表格行类型
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  expanded?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
}

// 分页配置类型
export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  pageSizeOptions?: string[];
  hideOnSinglePage?: boolean;
  simple?: boolean;
  disabled?: boolean;
} 