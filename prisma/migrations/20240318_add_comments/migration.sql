-- 添加字段注释
ALTER TABLE `car_info` MODIFY COLUMN `sale_date` DATETIME(0) NULL COMMENT '销售日期';
ALTER TABLE `car_info` MODIFY COLUMN `customer_name` VARCHAR(100) NULL COMMENT '客户姓名'; 