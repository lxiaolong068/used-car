-- Delete existing menu permissions
DELETE FROM role_permission WHERE permission_id IN (SELECT permission_id FROM permission WHERE permission_type = 'menu');
DELETE FROM permission WHERE permission_type = 'menu';

-- Insert new menu structure
INSERT INTO permission (permission_name, permission_key, permission_type, path, component, icon, sort_order, status, parent_id) VALUES
('仪表盘', 'dashboard', 'menu', '/dashboard', NULL, 'HomeIcon', 1, 1, NULL),
('用户管理', 'user_manage', 'menu', '/dashboard/users', NULL, 'UsersIcon', 2, 1, NULL),
('角色管理', 'role_manage', 'menu', '/dashboard/roles', NULL, 'KeyIcon', 3, 1, NULL),
('权限管理', 'permission_manage', 'menu', '/dashboard/permissions', NULL, 'ShieldCheckIcon', 4, 1, NULL),
('车辆管理', 'car_manage', 'menu', '/dashboard/cars', NULL, 'TruckIcon', 5, 1, NULL),
('费用管理', 'cost_manage', 'menu', '/dashboard/costs', NULL, 'CurrencyYenIcon', 6, 1, NULL),
('收入管理', 'revenue_management', 'menu', '/dashboard/revenues', NULL, 'BanknotesIcon', 7, 1, NULL);

-- Reassign menu permissions to super admin role
INSERT INTO role_permission (role_id, permission_id)
SELECT 
    (SELECT role_id FROM role WHERE role_key = 'super_admin'),
    permission_id
FROM permission
WHERE permission_type = 'menu'; 