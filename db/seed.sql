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
    `logo` VARCHAR(255),
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
PRIMARY KEY (`id`)
);

INSERT INTO companies (name, address1, address2, address3, city, county, postCode, country, vatNo, companyRegNo, email, telephone)
VALUES ('Firstport', 'Fifth Floor', 'The Lantern Building', '75 Hampstead Road', 'London', 'Greater London', 'NW1 2PL', 'United Kingdom', 'GB108238135', '04352396', 'info@firstport.org.uk', '01315640331', 'Complitas_logo_without_text.png')

INSERT INTO companies (name, address1, address2, address3, city, county, postCode, country, vatNo, companyRegNo, email, telephone)
VALUES ('Metropolitan housing association', 'The Grange', '100 High Street', '', 'London', 'Greater London', 'NW1 2PL', 'United Kingdom', 'GB123456789', '01234567', 'info@metropolitan.org.uk', '02071234567', 'Complitas_logo_without_text.png');


CREATE TABLE `properties` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    `siteName` VARCHAR(255) NOT NULL,
    `address1` VARCHAR(255),
    `address2` VARCHAR(255),
    `address3` VARCHAR(255),
    `city` VARCHAR(255),
    `county` VARCHAR(255),
    `postCode` VARCHAR(255),
    `country` VARCHAR(255),
    `telephone` VARCHAR(13),
    `managerName` VARCHAR(255),
    `companyId` VARCHAR(36) NOT NULL,
    `teamId` VARCHAR(36) DEFAULT NULL,
    `occupancyType` VARCHAR(255) DEFAULT NULL,
    `occupancyType` VARCHAR(255) NULL,
    `habitableHeight` DECIMAL(5,2) NULL,
    `buildingHeight` DECIMAL(5,2) NULL,
    `designDate` DATE NULL,
    `lifts` BOOLEAN NULL,
    `communalUtilityAssets` BOOLEAN NULL,
    `communalGasAppliances` BOOLEAN NULL,
    `meterBank` BOOLEAN NULL,
    `voidAssets` BOOLEAN NULL,
    `residentalFlats` INT NULL,
    `uniqueSupplyPoints` INT NULL,
    `commercialUnits` INT NULL,
    `wellMaintained` BOOLEAN NULL,
    `mitigationPlan` VARCHAR(255) NULL,
    `refurbished` BOOLEAN NULL,
    `refurbishedCDM` VARCHAR(255) NULL,
    `oms` BOOLEAN NULL,
    `managerEmail` VARCHAR(255) NULL,
    `managerTelephone` VARCHAR(255) NULL,
    `managerAddress` VARCHAR(255) NULL,
    `siteEmail` VARCHAR(255) NULL,
    `siteTelephone` VARCHAR(255) NULL,
    `emergencyName` VARCHAR(255) NULL,
    `emergencyEmail` VARCHAR(255) NULL,
    `emergencyTelephone` VARCHAR(255) NULL,
    `emergencyAddress` VARCHAR(255) NULL,
    `localFireName` VARCHAR(255) NULL,
    `localFireEmail` VARCHAR(255) NULL,
    `localFireTelephone` VARCHAR(255) NULL,
    `localFireAddress` VARCHAR(255) NULL,
    `localFireDetails` VARCHAR(255) NULL,
    `carpark` BOOLEAN NULL,
    `uniqueReferenceNumber` VARCHAR(255) NULL,
    `residentialAwareness` VARCHAR(255) NULL,
    `logBook` BOOLEAN NULL,
    `fireSafetyLogBook` BOOLEAN NULL,
    `electronicAuditCompleted` BOOLEAN NULL,
    `epc` BOOLEAN NULL,
    `energyCertificates` BOOLEAN NULL,
    `isolationValvesClear` BOOLEAN NULL,
    `accessControlled` BOOLEAN NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` VARCHAR(255) DEFAULT NULL,
    CONSTRAINT fk_companies
    FOREIGN KEY (companyId)
    REFERENCES company (id) ON DELETE CASCADE
        CONSTRAINT fk_team_propety FOREIGN KEY (teamId) REFERENCES teams (id) ON DELETE CASCADE

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
    `teamId` VARCHAR(36) DEFAULT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` VARCHAR(255) DEFAULT NULL,

    CONSTRAINT fk_companies_user FOREIGN KEY (companyId) REFERENCES companies (id) ON DELETE CASCADE
    CONSTRAINT fk_team_user FOREIGN KEY (teamId) REFERENCES teams (id) ON DELETE CASCADE
)

CREATE TABLE teams (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    `companyId` VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    `name` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_members (
    `teamId` VARCHAR(36) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    `userId` VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (teamId, userId)
);

CREATE TABLE team_properties (
    `teamId` VARCHAR(36) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    `propertyId` VARCHAR(36) NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    PRIMARY KEY (teamId, propertyId)
);

CREATE TABLE IF NOT EXISTS compliance_questions (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    `question` VARCHAR(255) NOT NULL,
    `answerType` VARCHAR(255) NOT NULL,
    `uploadRequired` TINYINT(1) NOT NULL,
    `uploadedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE IF NOT EXISTS property_compliance (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    `propertyId` VARCHAR(36) NOT NULL,
    `questionId` VARCHAR(36) NOT NULL,
    `answer` VARCHAR(255) NOT NULL,
    `fileName` VARCHAR(255),
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_property FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT fk_question FOREIGN KEY (questionId) REFERENCES compliance_questions(id) ON DELETE CASCADE
);