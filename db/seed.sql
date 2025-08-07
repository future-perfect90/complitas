CREATE DATABASE IF NOT EXISTS `complitas`;
USE `complitas`;

CREATE TABLE IF NOT EXISTS `companies` (
    `id` INT(16) NOT NULL AUTO_INCREMENT,
    `company_name` VARCHAR(255) NOT NULL,
    `address_line_1` VARCHAR(255),
    `address_line_2` VARCHAR(255),
    `address_line_3` VARCHAR(255),
    `city` VARCHAR(255),
    `county` VARCHAR(255),
    `post_code` VARCHAR(255),
    `country` VARCHAR(255),
    `vat_no` VARCHAR(255),
    `company_reg_no` VARCHAR(255),
    `email` VARCHAR(255),
    `telephone` VARCHAR(13),
    PRIMARY KEY (`id`)
);