CREATE DATABASE IF NOT EXISTS `complitas`;
USE `complitas`;

CREATE TABLE IF NOT EXISTS `companies` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
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

INSERT INTO companies (name, address1, address2, address3, city, county, postCode, country, vatNo, companyRegNo, email, telephone)
VALUES ('Firstport', 'Fifth Floor', 'The Lantern Building', '75 Hampstead Road', 'London', 'Greater London', 'NW1 2PL', 'United Kingdom', 'GB108238135', '04352396', 'info@firstport.org.uk', '01315640331')

INSERT INTO companies (name, address1, address2, address3, city, county, postCode, country, vatNo, companyRegNo, email, telephone)
VALUES ('Metropolitan housing association', 'The Grange', '100 High Street', '', 'London', 'Greater London', 'NW1 2PL', 'United Kingdom', 'GB123456789', '01234567', 'info@metropolitan.org.uk', '02071234567');


CREATE TABLE `properties` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `address1` VARCHAR(255),
    `address2` VARCHAR(255),
    `address3` VARCHAR(255),
    `city` VARCHAR(255),
    `county` VARCHAR(255),
    `postCode` VARCHAR(255),
    `country` VARCHAR(255),
    `email` VARCHAR(255),
    `telephone` VARCHAR(13),
    `managerName` VARCHAR(255),
    `companyId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` VARCHAR(255) DEFAULT NULL,
    CONSTRAINT fk_companies
    FOREIGN KEY (companyId)
    REFERENCES company (id) ON DELETE CASCADE
);

INSERT INTO properties (name, address1, address2, city, county, postCode, country, managerName, email, telephone, companyId)
VALUES ('Forge Court', 'Melton Road', 'Syston', 'Leicester', 'Leicestershire', 'LE7 2DX', 'United Kingdom', 'Susan Holmes','susan@firstport.org.uk', '01162697290', '156659f4-77b3-11f0-910a-6a02ccf97a78')

INSERT INTO properties (name, address1, address2, city, county, postCode, country, managerName, email, telephone, companyId)
VALUES ('Checkland Road', 'Checkland Road', '', 'Leicester', 'Leicestershire', 'LE4 8FE', 'United Kingdom', 'Steve Charles','steve@metropolitan.org.uk', '01162697290', 'e81e211c-77bb-11f0-910a-6a02ccf97a78')

CREATE TABLE `user` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255),
    `companyId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` VARCHAR(255) DEFAULT NULL,
    CONSTRAINT fk_companies_user
    FOREIGN KEY (companyId)
    REFERENCES companies (id) ON DELETE CASCADE
)