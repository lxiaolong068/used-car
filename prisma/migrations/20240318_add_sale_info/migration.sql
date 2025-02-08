-- 添加销售日期和客户名称字段
ALTER TABLE `car_info` ADD COLUMN `sale_date` DATETIME(0) NULL;
ALTER TABLE `car_info` ADD COLUMN `customer_name` VARCHAR(100) NULL;
ALTER TABLE `car_info` ADD INDEX `customer_name` (`customer_name`); 