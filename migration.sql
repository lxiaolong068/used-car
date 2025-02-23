-- CreateTable
CREATE TABLE `car_info` (
    `vehicle_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `vin` VARCHAR(50) NOT NULL,
    `vehicle_model` VARCHAR(20) NOT NULL,
    `register_date` DATETIME(0) NOT NULL,
    `purchase_date` DATETIME(0) NOT NULL,
    `mileage` DECIMAL(5, 2) NOT NULL,
    `sale_date` DATETIME(0) NULL,
    `customer_name` VARCHAR(100) NULL,
    `create_time` DATETIME(0) NULL,
    `update_time` DATETIME(0) NULL,

    INDEX `vehicle_model`(`vehicle_model`),
    INDEX `vin`(`vin`),
    INDEX `customer_name`(`customer_name`),
    PRIMARY KEY (`vehicle_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cost_management` (
    `cost_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `vehicle_id` INTEGER UNSIGNED NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `remark` VARCHAR(255) NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `payment_phase` INTEGER UNSIGNED NOT NULL,
    `create_time` DATETIME(0) NULL,
    `update_time` DATETIME(0) NULL,
    `payment_date` DATETIME(0) NOT NULL,

    INDEX `remark`(`remark`),
    INDEX `type`(`type`),
    INDEX `vehicle_id`(`vehicle_id`),
    PRIMARY KEY (`cost_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `operation_log` (
    `log_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `action_type` VARCHAR(20) NOT NULL,
    `details` TEXT NULL,
    `ip_address` VARCHAR(45) NULL,
    `create_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sale_info` (
    `sale_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `vehicle_id` INTEGER UNSIGNED NOT NULL,
    `sale_price` DECIMAL(5, 2) NOT NULL,
    `sale_date` DATETIME(0) NOT NULL,
    `buyer_info` VARCHAR(255) NOT NULL,
    `create_time` DATETIME(0) NULL,
    `update_time` DATETIME(0) NULL,
    `sale_remark` TEXT NULL,
    `sale_status` TINYBLOB NOT NULL,
    `payment_type` VARCHAR(20) NOT NULL,

    INDEX `buyer_info`(`buyer_info`),
    INDEX `vehicle_id`(`vehicle_id`),
    PRIMARY KEY (`sale_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `revenue_management` (
    `revenue_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `vehicle_id` INTEGER UNSIGNED NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `remark` VARCHAR(255) NOT NULL,
    `revenue_phase` TINYINT UNSIGNED NOT NULL,
    `payment_date` DATETIME(0) NOT NULL,
    `create_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_time` DATETIME(0) NULL,

    INDEX `vehicle_id`(`vehicle_id`),
    INDEX `remark`(`remark`),
    PRIMARY KEY (`revenue_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `role_id` INTEGER UNSIGNED NOT NULL,
    `create_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `username`(`username`),
    INDEX `user_role_id_idx`(`role_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `role_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(50) NOT NULL,
    `role_key` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `create_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_time` DATETIME(0) NULL,

    UNIQUE INDEX `role_role_key_key`(`role_key`),
    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permission` (
    `permission_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `parent_id` INTEGER UNSIGNED NULL,
    `permission_name` VARCHAR(50) NOT NULL,
    `permission_key` VARCHAR(50) NOT NULL,
    `permission_type` VARCHAR(20) NOT NULL,
    `path` VARCHAR(255) NULL,
    `component` VARCHAR(255) NULL,
    `icon` VARCHAR(50) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `status` TINYINT NOT NULL DEFAULT 1,
    `create_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_time` DATETIME(0) NULL,

    UNIQUE INDEX `permission_permission_key_key`(`permission_key`),
    INDEX `permission_parent_id_idx`(`parent_id`),
    PRIMARY KEY (`permission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permission` (
    `role_id` INTEGER UNSIGNED NOT NULL,
    `permission_id` INTEGER UNSIGNED NOT NULL,
    `create_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `role_permission_permission_id_idx`(`permission_id`),
    PRIMARY KEY (`role_id`, `permission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cost_management` ADD CONSTRAINT `cost_management_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `car_info`(`vehicle_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `revenue_management` ADD CONSTRAINT `revenue_management_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `car_info`(`vehicle_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `permission` ADD CONSTRAINT `permission_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `permission`(`permission_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`permission_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

