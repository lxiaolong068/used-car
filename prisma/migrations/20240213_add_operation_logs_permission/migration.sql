-- 添加系统管理菜单
INSERT INTO permission (permission_name, permission_key, permission_type, path, component, icon, sort_order, status, create_time)
VALUES ('系统管理', 'system', 'menu', '/dashboard/system', NULL, 'Settings', 900, 1, NOW());

-- 添加操作日志菜单
INSERT INTO permission (permission_name, permission_key, permission_type, path, component, icon, sort_order, status, create_time, parent_id)
SELECT '操作日志', 'operation_logs', 'menu', '/dashboard/logs', NULL, 'FileText', 920, 1, NOW(), permission_id
FROM permission
WHERE permission_key = 'system';

-- 添加查看操作日志权限
INSERT INTO permission (permission_name, permission_key, permission_type, path, component, icon, sort_order, status, create_time, parent_id)
SELECT '查看操作日志', 'view_operation_logs', 'action', NULL, NULL, NULL, 921, 1, NOW(), permission_id
FROM permission
WHERE permission_key = 'operation_logs'; 