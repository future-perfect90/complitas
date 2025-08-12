CREATE DATABASE IF NOT EXISTS `complitas`;
USE `complitas`;

CREATE TABLE IF NOT EXISTS `companies` (
    `id` INT(16) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `address1` VARCHAR(255),
    `address2` VARCHAR(255),
    `address3` VARCHAR(255),
    `city` VARCHAR(255),
    `county` VARCHAR(255),
    `postCode` VARCHAR(255),
    `country` VARCHAR(255),
    `vatNo` VARCHAR(255),
    `companyRegNo` VARCHAR(255),
    `email` VARCHAR(255),
    `telephone` VARCHAR(13),
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
PRIMARY KEY (`id`)
);