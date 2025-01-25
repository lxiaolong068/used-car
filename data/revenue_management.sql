-- 收款管理表
CREATE TABLE `revenue_management`  (
  `revenue_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `vehicle_id` int(10) UNSIGNED NOT NULL COMMENT '车辆id',
  `amount` decimal(5, 2) NOT NULL COMMENT '收款金额',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '备注',
  `revenue_phase` tinyint(4) NOT NULL COMMENT '第几次收款',
  `payment_date` datetime NOT NULL COMMENT '收款时间',
  PRIMARY KEY (`revenue_id`) USING BTREE,
  INDEX `vehicle_id`(`vehicle_id`) USING BTREE,
  INDEX `remark`(`remark`) USING BTREE
) 
