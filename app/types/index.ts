// 导出所有类型定义
export * from './components';
export * from './events';
export * from './styles';

// 通用响应类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 分页请求参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 分页响应数据
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 车辆信息
export interface CarInfo {
  vehicle_id: number;
  vin: string;
  vehicle_model: string;
  register_date: string;
  purchase_date: string;
  mileage: number;
  create_time?: string;
  update_time?: string;
}

// 成本管理
export interface CostManagement {
  cost_id: number;
  vehicle_id: number;
  amount: number;
  remark: string;
  type: string;
  payment_phase: number;
  create_time?: string;
  update_time?: string;
  payment_date: string;
}

// 收入管理
export interface RevenueManagement {
  revenue_id: number;
  vehicle_id: number;
  amount: number;
  remark: string;
  revenue_phase: number;
  payment_date: string;
  create_time?: string;
  update_time?: string;
}

// 用户信息
export interface User {
  user_id: number;
  username: string;
  role_id: number;
  create_time?: string;
  role?: Role;
}

// 角色信息
export interface Role {
  role_id: number;
  role_name: string;
  role_key: string;
  description?: string;
  status: number;
  create_time?: string;
  update_time?: string;
  permissions?: Permission[];
}

// 权限信息
export interface Permission {
  permission_id: number;
  parent_id?: number;
  permission_name: string;
  permission_key: string;
  permission_type: string;
  path?: string;
  component?: string;
  icon?: string;
  sort_order: number;
  status: number;
  create_time?: string;
  update_time?: string;
  children?: Permission[];
}

// 表格列配置
export interface TableColumn<T = any> {
  key: string;
  title: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

// 表单字段配置
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'radio' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: Array<{
    label: string;
    value: string | number;
  }>;
  rules?: Array<{
    required?: boolean;
    message?: string;
    pattern?: RegExp;
    validator?: (value: any) => Promise<void> | void;
  }>;
}

// 操作日志
export interface OperationLog {
  log_id: number;
  user_id: number;
  action_type: string;
  details?: string;
  ip_address?: string;
  create_time?: string;
}

// 销售信息
export interface SaleInfo {
  sale_id: number;
  vehicle_id: number;
  sale_price: number;
  sale_date: string;
  buyer_info: string;
  create_time?: string;
  update_time?: string;
  sale_remark?: string;
  sale_status: number;
  payment_type: string;
}

// 树形节点
export interface TreeNode {
  id: number | string;
  name: string;
  key?: string;
  type?: string;
  path?: string;
  icon?: string;
  children?: TreeNode[];
  parentId?: number | string | null;
  [key: string]: any;
}

// 文件上传配置
export interface UploadConfig {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxCount?: number;
  listType?: 'text' | 'picture' | 'picture-card';
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  onProgress?: (percent: number) => void;
  onSuccess?: (response: any) => void;
  onError?: (error: Error) => void;
}

// 菜单项
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  permission?: string;
} 