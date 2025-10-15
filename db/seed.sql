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
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `properties` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
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
    `hrbUniqueReferenceNumber` VARCHAR(255) NULL,
	`bsrRegistrationNumber`	VARCHAR(255) NULL,
	`principleName`	VARCHAR(255) NULL,
	`principleEmail`	VARCHAR(255) NULL,
	`principleTelephone`	VARCHAR(255) NULL,
	`principleAddress`	VARCHAR(255) NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` VARCHAR(255) DEFAULT NULL,
    CONSTRAINT fk_companies FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE `user` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255),
    `companyId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` VARCHAR(255) DEFAULT NULL,

    CONSTRAINT fk_companies_user FOREIGN KEY (companyId) REFERENCES companies (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS compliance_questions (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    `area` VARCHAR(255) NOT NULL,
    `question` VARCHAR(255) NOT NULL,
    `answerType` VARCHAR(255) NOT NULL,
    `uploadRequired` TINYINT(1) NOT NULL,
    `hasLifts` TINYINT(1) NOT NULL DEFAULT 0,
    `hasCommunalAssets` TINYINT(1) NOT NULL DEFAULT 0,
    `hasCommunalGas` TINYINT(1) NOT NULL DEFAULT 0,
    `hasBasementCarpark` TINYINT(1) NOT NULL DEFAULT 0,
    `hasVoids` TINYINT(1) NOT NULL DEFAULT 0,
);

CREATE TABLE IF NOT EXISTS reports (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    `propertyId` VARCHAR(36) NOT NULL,
    CONSTRAINT fk_property FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS question_responses (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    `reportId` VARCHAR(36) NOT NULL,
    `propertyId` VARCHAR(36) NULL,
    `questionId` VARCHAR(36) NOT NULL,
    `answer` TINYINT(1) NOT NULL,
    `fileName` VARCHAR(255) NULL,
    `validUntil` DATE NULL,
    `completedBy` VARCHAR(255) NOT NULL,
    CONSTRAINT fk_reports FOREIGN KEY (reportId) REFERENCES reports(id),
    CONSTRAINT fk_question FOREIGN KEY (questionId) REFERENCES compliance_questions(id),
    CONSTRAINT fk_response_property FOREIGN KEY (propertyId) REFERENCES properties(id),
    CONSTRAINT fk_user FOREIGN KEY (completedBy) REFERENCES user(id),
    UNIQUE KEY `reportId` (`reportId`,`questionId`)
);

CREATE TABLE IF NOT EXISTS `maintenance_companies` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `name` VARCHAR(255) NOT NULL,
    `contactName` VARCHAR(255),
    `contactAddress` VARCHAR(255),
    `contactNumber` VARCHAR(255),
PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `maintenance_tasks` (
    `id` VARCHAR(36) NOT NULL DEFAULT (UUID()),
    `title` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255),
    `typeOfWork` VARCHAR(255),
    `address3` VARCHAR(255),
    `evidence` VARCHAR(255),
    `completedAt` VARCHAR(255),
    `completedBy` VARCHAR(36),
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` VARCHAR(255),
    `propertyId` VARCHAR(36),
    CONSTRAINT fk_property_maintenance FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT fk_maintenance_company FOREIGN KEY (completedBy) REFERENCES maintenance_companies(id) ON DELETE CASCADE,
PRIMARY KEY (`id`)
);

CREATE TABLE notification_preferences (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    propertyId VARCHAR(36) NOT NULL,
    daysBeforeExpiry SMALLINT UNSIGNED NOT NULL,
    isActive TINYINT(1) DEFAULT 1,
    INDEX idx_property_id (propertyId),     
    CONSTRAINT fk_property_notification_preferences FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE,
PRIMARY KEY (`id`)
);


CREATE TABLE audit_log (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    performingUserId VARCHAR(36),
    actionType ENUM('INSERT', 'UPDATE', 'DELETE', 'ANSWER') NOT NULL,
    tableName VARCHAR(255) NOT NULL,
    recordId VARCHAR(36) NOT NULL,
    fieldName VARCHAR(255),
    oldValue TEXT,
    newValue TEXT,
    propertyId VARCHAR(36),
    FOREIGN KEY (performingUserId) REFERENCES user(id),
    PRIMARY KEY (`id`)
);