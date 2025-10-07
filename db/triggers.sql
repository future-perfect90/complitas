DELIMITER $$
CREATE TRIGGER IF NOT EXISTS properties_after_insert
AFTER INSERT ON properties
FOR EACH ROW
BEGIN
    DECLARE changer_id VARCHAR(36);
    SET changer_id = @current_user_id;

    INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value)
    VALUES (changer_id, 'INSERT', 'properties', NEW.id, NULL, NULL, CONCAT('Property created with name: ', NEW.name)),
    (changer_id, 'INSERT', 'properties', NEW.id, NULL, NULL, CONCAT('Property created with initial address: ', NEW.address1, NEW.address2, NEW.address3, NEW.city, NEW.county, NEW.postCode, NEW.country)),
    (changer_id, 'INSERT', 'properties', NEW.id, NULL, NULL, CONCAT('Property created with manager: ', NEW.managerName, NEW.email, NEW.telephone));
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER IF NOT EXISTS properties_after_update
AFTER UPDATE ON properties
FOR EACH ROW
BEGIN
    DECLARE changer_id VARCHAR(36);
    SET changer_id = @current_user_id;

    IF NOT (OLD.name <=> NEW.name) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'name', OLD.name, NEW.name);
    END IF;

    IF NOT (OLD.address1 <=> NEW.address1) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'address1', OLD.address1, NEW.address1);
    END IF;

    IF NOT (OLD.address2 <=> NEW.address2) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'address2', OLD.address2, NEW.address2);
    END IF;

    IF NOT (OLD.address3 <=> NEW.address3) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'address3', OLD.address3, NEW.address3);
    END IF;

    IF NOT (OLD.city <=> NEW.city) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'city', OLD.city, NEW.city);
    END IF;

    IF NOT (OLD.county <=> NEW.county) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'county', OLD.county, NEW.county);
    END IF;

    IF NOT (OLD.postCode <=> NEW.postCode) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'postCode', OLD.postCode, NEW.postCode);
    END IF;

    IF NOT (OLD.country <=> NEW.country) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'country', OLD.country, NEW.country);
    END IF;

    IF NOT (OLD.email <=> NEW.email) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'email', OLD.email, NEW.email);
    END IF;

    IF NOT (OLD.telephone <=> NEW.telephone) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'telephone', OLD.telephone, NEW.telephone);
    END IF;

    IF NOT (OLD.managerName <=> NEW.managerName) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'managerName', OLD.managerName, NEW.managerName);
    END IF;

    IF NOT (OLD.companyId <=> NEW.companyId) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'companyId', OLD.companyId, NEW.companyId);
    END IF;

    IF NOT (OLD.teamId <=> NEW.teamId) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'teamId', OLD.teamId, NEW.teamId);
    END IF;

    IF NOT (OLD.createdAt <=> NEW.createdAt) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'createdAt', OLD.createdAt, NEW.createdAt);
    END IF;

    IF NOT (OLD.createdBy <=> NEW.createdBy) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'createdBy', OLD.createdBy, NEW.createdBy);
    END IF;

    IF NOT (OLD.occupancyType <=> NEW.occupancyType) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'occupancyType', OLD.occupancyType, NEW.occupancyType);
    END IF;

    IF NOT (OLD.habitableHeight <=> NEW.habitableHeight) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'habitableHeight', OLD.habitableHeight, NEW.habitableHeight);
    END IF;

    IF NOT (OLD.buildingHeight <=> NEW.buildingHeight) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'buildingHeight', OLD.buildingHeight, NEW.buildingHeight);
    END IF;

    IF NOT (OLD.designDate <=> NEW.designDate) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'designDate', OLD.designDate, NEW.designDate);
    END IF;

    IF NOT (OLD.lifts <=> NEW.lifts) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'lifts', OLD.lifts, NEW.lifts);
    END IF;

    IF NOT (OLD.communalUtilityAssets <=> NEW.communalUtilityAssets) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'communalUtilityAssets', OLD.communalUtilityAssets, NEW.communalUtilityAssets);
    END IF;

    IF NOT (OLD.communalGasAppliances <=> NEW.communalGasAppliances) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'communalGasAppliances', OLD.communalGasAppliances, NEW.communalGasAppliances);
    END IF;

    IF NOT (OLD.meterBank <=> NEW.meterBank) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'meterBank', OLD.meterBank, NEW.meterBank);
    END IF;

    IF NOT (OLD.voidAssets <=> NEW.voidAssets) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'voidAssets', OLD.voidAssets, NEW.voidAssets);
    END IF;

    IF NOT (OLD.residentalFlats <=> NEW.residentalFlats) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'residentalFlats', OLD.residentalFlats, NEW.residentalFlats);
    END IF;

    IF NOT (OLD.uniqueSupplyPoints <=> NEW.uniqueSupplyPoints) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'uniqueSupplyPoints', OLD.uniqueSupplyPoints, NEW.uniqueSupplyPoints);
    END IF;

    IF NOT (OLD.commercialUnits <=> NEW.commercialUnits) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'commercialUnits', OLD.commercialUnits, NEW.commercialUnits);
    END IF;

    IF NOT (OLD.wellMaintained <=> NEW.wellMaintained) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'wellMaintained', OLD.wellMaintained, NEW.wellMaintained);
    END IF;

    IF NOT (OLD.mitigationPlan <=> NEW.mitigationPlan) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'mitigationPlan', OLD.mitigationPlan, NEW.mitigationPlan);
    END IF;

    IF NOT (OLD.refurbished <=> NEW.refurbished) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'refurbished', OLD.refurbished, NEW.refurbished);
    END IF;

    IF NOT (OLD.refurbishedCDM <=> NEW.refurbishedCDM) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'refurbishedCDM', OLD.refurbishedCDM, NEW.refurbishedCDM);
    END IF;

    IF NOT (OLD.oms <=> NEW.oms) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'oms', OLD.oms, NEW.oms);
    END IF;

    IF NOT (OLD.managerEmail <=> NEW.managerEmail) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'managerEmail', OLD.managerEmail, NEW.managerEmail);
    END IF;

    IF NOT (OLD.managerTelephone <=> NEW.managerTelephone) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'managerTelephone', OLD.managerTelephone, NEW.managerTelephone);
    END IF;

    IF NOT (OLD.managerAddress <=> NEW.managerAddress) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'managerAddress', OLD.managerAddress, NEW.managerAddress);
    END IF;

    IF NOT (OLD.siteEmail <=> NEW.siteEmail) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'siteEmail', OLD.siteEmail, NEW.siteEmail);
    END IF;

    IF NOT (OLD.siteTelephone <=> NEW.siteTelephone) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'siteTelephone', OLD.siteTelephone, NEW.siteTelephone);
    END IF;

    IF NOT (OLD.emergencyName <=> NEW.emergencyName) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'emergencyName', OLD.emergencyName, NEW.emergencyName);
    END IF;

    IF NOT (OLD.emergencyEmail <=> NEW.emergencyEmail) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'emergencyEmail', OLD.emergencyEmail, NEW.emergencyEmail);
    END IF;

    IF NOT (OLD.emergencyTelephone <=> NEW.emergencyTelephone) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'emergencyTelephone', OLD.emergencyTelephone, NEW.emergencyTelephone);
    END IF;

    IF NOT (OLD.emergencyAddress <=> NEW.emergencyAddress) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'emergencyAddress', OLD.emergencyAddress, NEW.emergencyAddress);
    END IF;

    IF NOT (OLD.localFireName <=> NEW.localFireName) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'localFireName', OLD.localFireName, NEW.localFireName);
    END IF;

    IF NOT (OLD.localFireEmail <=> NEW.localFireEmail) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'localFireEmail', OLD.localFireEmail, NEW.localFireEmail);
    END IF;

    IF NOT (OLD.localFireTelephone <=> NEW.localFireTelephone) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'localFireTelephone', OLD.localFireTelephone, NEW.localFireTelephone);
    END IF;

    IF NOT (OLD.localFireAddress <=> NEW.localFireAddress) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'localFireAddress', OLD.localFireAddress, NEW.localFireAddress);
    END IF;

    IF NOT (OLD.localFireDetails <=> NEW.localFireDetails) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'localFireDetails', OLD.localFireDetails, NEW.localFireDetails);
    END IF;

    IF NOT (OLD.carpark <=> NEW.carpark) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'carpark', OLD.carpark, NEW.carpark);
    END IF;

    IF NOT (OLD.uniqueReferenceNumber <=> NEW.uniqueReferenceNumber) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'uniqueReferenceNumber', OLD.uniqueReferenceNumber, NEW.uniqueReferenceNumber);
    END IF;

    IF NOT (OLD.residentialAwareness <=> NEW.residentialAwareness) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'residentialAwareness', OLD.residentialAwareness, NEW.residentialAwareness);
    END IF;

    IF NOT (OLD.logBook <=> NEW.logBook) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'logBook', OLD.logBook, NEW.logBook);
    END IF;

    IF NOT (OLD.fireSafetyLogBook <=> NEW.fireSafetyLogBook) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'fireSafetyLogBook', OLD.fireSafetyLogBook, NEW.fireSafetyLogBook);
    END IF;

    IF NOT (OLD.electronicAuditCompleted <=> NEW.electronicAuditCompleted) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'electronicAuditCompleted', OLD.electronicAuditCompleted, NEW.electronicAuditCompleted);
    END IF;

    IF NOT (OLD.epc <=> NEW.epc) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'epc', OLD.epc, NEW.epc);
    END IF;

    IF NOT (OLD.energyCertificates <=> NEW.energyCertificates) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'energyCertificates', OLD.energyCertificates, NEW.energyCertificates);
    END IF;

    IF NOT (OLD.isolationValvesClear <=> NEW.isolationValvesClear) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'isolationValvesClear', OLD.isolationValvesClear, NEW.isolationValvesClear);
    END IF;

    IF NOT (OLD.accessControlled <=> NEW.accessControlled) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'accessControlled', OLD.accessControlled, NEW.accessControlled);
    END IF;

    IF NOT (OLD.hrbUniqueReferenceNumber <=> NEW.hrbUniqueReferenceNumber) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'hrbUniqueReferenceNumber', OLD.hrbUniqueReferenceNumber, NEW.hrbUniqueReferenceNumber);
    END IF;

    IF NOT (OLD.bsrRegistrationNumber <=> NEW.bsrRegistrationNumber) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'bsrRegistrationNumber', OLD.bsrRegistrationNumber, NEW.bsrRegistrationNumber);
    END IF;

    IF NOT (OLD.principleName <=> NEW.principleName) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'principleName', OLD.principleName, NEW.principleName);
    END IF;

    IF NOT (OLD.principleEmail <=> NEW.principleEmail) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'principleEmail', OLD.principleEmail, NEW.principleEmail);
    END IF;

    IF NOT (OLD.principleTelephone <=> NEW.principleTelephone) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'principleTelephone', OLD.principleTelephone, NEW.principleTelephone);
    END IF;

    IF NOT (OLD.principleAddress <=> NEW.principleAddress) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value) VALUES (changer_id, 'UPDATE', 'properties', OLD.id, 'principleAddress', OLD.principleAddress, NEW.principleAddress);
    END IF;

END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER IF NOT EXISTS properties_before_delete
BEFORE DELETE ON properties
FOR EACH ROW
BEGIN
    DECLARE changer_id VARCHAR(36);
    SET changer_id = @current_user_id;

    INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value)
    VALUES (
        changer_id,
        'DELETE',
        'properties',
        OLD.id,
        NULL,
        CONCAT('id: ', OLD.id, 'name: ', OLD.name),
        ''
    );
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER IF NOT EXISTS question_answered_insert
AFTER INSERT ON question_responses
FOR EACH ROW
BEGIN
    DECLARE changer_id VARCHAR(36);
    SET changer_id = @current_user_id;

    INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value)
    VALUES (changer_id, 'INSERT', 'question_responses', NEW.id, 'answer', NULL, NEW.answer);

END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER IF NOT EXISTS question_answered_update
AFTER UPDATE ON question_responses
FOR EACH ROW
BEGIN
    DECLARE changer_id VARCHAR(36);
    SET changer_id = @current_user_id;

    IF NOT (OLD.answer <=> NEW.answer) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value)
        VALUES (changer_id, 'UPDATE', 'question_responses', NEW.id, 'answer', OLD.answer, NEW.answer);
    END IF;

    IF NOT (OLD.validUntil <=> NEW.validUntil) THEN
        INSERT INTO audit_log (performing_user_id, action_type, table_name, record_id, field_name, old_value, new_value)
        VALUES (changer_id, 'UPDATE', 'question_responses', NEW.id, 'validUntil', OLD.validUntil, NEW.validUntil);
    END IF;
END$$

DELIMITER ;