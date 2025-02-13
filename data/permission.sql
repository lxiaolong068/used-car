-- 权限表
CREATE TABLE `permission` (
  `permission_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '权限ID',
  `parent_id` int UNSIGNED DEFAULT NULL COMMENT '父权限ID',
  `permission_name` varchar(50) NOT NULL COMMENT '权限名称',
  `permission_key` varchar(50) NOT NULL COMMENT '权限标识符',
  `permission_type` varchar(20) NOT NULL COMMENT '权限类型：menu-菜单，button-按钮，api-接口',
  `path` varchar(255) DEFAULT NULL COMMENT '路由路径',
  `component` varchar(255) DEFAULT NULL COMMENT '前端组件路径',
  `icon` varchar(50) DEFAULT NULL COMMENT '图标',
  `sort_order` int DEFAULT '0' COMMENT '排序',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`permission_id`),
  UNIQUE KEY `uk_permission_key` (`permission_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

-- 插入基础权限数据
INSERT INTO `permission` (`parent_id`, `permission_name`, `permission_key`, `permission_type`, `path`, `component`) VALUES 
(NULL, '仪表盘', 'dashboard', 'menu', '/dashboard', 'dashboard/index'),
(NULL, '用户管理', 'user_manage', 'menu', '/dashboard/users', 'dashboard/users/index'),
(NULL, '车辆管理', 'car_manage', 'menu', '/dashboard/cars', 'dashboard/cars/index'),
(NULL, '销售管理', 'sale_manage', 'menu', '/dashboard/sales', 'dashboard/sales/index'),
(NULL, '成本管理', 'cost_manage', 'menu', '/dashboard/costs', 'dashboard/costs/index');

-- 系统管理
INSERT INTO permission (permission_name, permission_key, permission_type, path, component, icon, sort_order, parent_id)
VALUES ('系统管理', 'system', 'menu', '/dashboard/system', null, 'Settings', 900, null);

-- 操作日志
INSERT INTO permission (permission_name, permission_key, permission_type, path, component, icon, sort_order, parent_id)
VALUES ('操作日志', 'operation_logs', 'menu', '/dashboard/logs', null, 'FileText', 920, 
  (SELECT permission_id FROM (SELECT * FROM permission) AS p WHERE permission_key = 'system'));

-- 查看操作日志权限
INSERT INTO permission (permission_name, permission_key, permission_type, path, component, icon, sort_order, parent_id)
VALUES ('查看操作日志', 'view_operation_logs', 'action', null, null, null, 921, 
  (SELECT permission_id FROM (SELECT * FROM permission) AS p WHERE permission_key = 'operation_logs'));