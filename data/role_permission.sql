-- 角色权限关联表
CREATE TABLE `role_permission` (
  `role_id` int UNSIGNED NOT NULL COMMENT '角色ID',
  `permission_id` int UNSIGNED NOT NULL COMMENT '权限ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`role_id`, `permission_id`),
  KEY `idx_permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色权限关联表';

INSERT INTO `user` (`username`, `password`, `role_id`) 
VALUES ('zhouwen', '$2b$08$LdXwxAMM6rxNooQSLw7x.uMi9w7GVDEA0BPnzini.HD/AtRwKIP0.', 1);

-- 确保该用户拥有所有权限（通过角色关联）
INSERT INTO `role_permission` (`role_id`, `permission_id`)
SELECT 1, permission_id 
FROM `permission` p
WHERE NOT EXISTS (
    SELECT 1 
    FROM `role_permission` rp 
    WHERE rp.role_id = 1 
    AND rp.permission_id = p.permission_id
);