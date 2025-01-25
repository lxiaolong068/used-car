-- 操作日志表
CREATE TABLE `operation_log` (
  `log_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL COMMENT '操作用户',
  `action_type` VARCHAR(20) NOT NULL COMMENT '操作类型（如login, update）',
  `details` TEXT COMMENT '操作详情',
  `ip_address` VARCHAR(45) COMMENT '操作IP',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  INDEX `user_id` (`user_id`)
);