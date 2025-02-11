ALTER TABLE car_info
ADD COLUMN sale_status TINYINT NOT NULL DEFAULT 0 COMMENT '销售状态：0-在售，1-已售';

-- 更新已有记录：如果有销售日期的设为已售
UPDATE car_info SET sale_status = 1 WHERE sale_date IS NOT NULL; 