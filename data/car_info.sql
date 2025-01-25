-- 车辆信息表

CREATE TABLE `car_info`  (
  `vehicle_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `vin` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '车架号',
  `vehicle_model` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '车辆型号',
  `register_date` datetime NOT NULL COMMENT '注册日期',
  `purchase_date` datetime NOT NULL COMMENT '购买日期',
  `mileage` decimal(5, 2) NOT NULL COMMENT '公里数',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`vehicle_id`) USING BTREE,
  INDEX `vin`(`vin`) USING BTREE,
  INDEX `vehicle_model`(`vehicle_model`) USING BTREE
) 
