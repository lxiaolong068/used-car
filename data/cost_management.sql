-- 成本管理表

CREATE TABLE `cost_management`  (
  `cost_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `vehicle_id` int(10) UNSIGNED NOT NULL COMMENT '车辆id',
  `amount` decimal(5, 2) NOT NULL COMMENT '成本',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '备注',
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '成本类型',
  `payment_phase` tinyblob NOT NULL COMMENT '第几次付款',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `payment_date` datetime NOT NULL COMMENT '付款时间',
  PRIMARY KEY (`cost_id`) USING BTREE,
  INDEX `vehicle_id`(`vehicle_id`) USING BTREE,
  INDEX `remark`(`remark`) USING BTREE,
  INDEX `type`(`type`) USING BTREE
) 