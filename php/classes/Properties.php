<?php

use Ramsey\Uuid\Uuid;


class Properties
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function listAll(string $companyId): array
    {
        $stmt = $this->pdo->prepare("SELECT id, name, address1, address2, address3, city, county, postCode, country, managerEmail, telephone, managerName FROM properties where companyId = :company_id");
        $stmt->bindParam(':company_id', $companyId);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create(array $propertyData, string $createdBy): array
    {
        $lookup = "SELECT count(id) FROM properties WHERE name = :property_name and companyId = :company_id";
        $stmt = $this->pdo->prepare($lookup);
        $stmt->bindParam(':property_name', $propertyData['name']);
        $stmt->bindParam(':company_id', $companyId);
        $stmt->execute();
        $rowCount = $stmt->fetchColumn();
        if ($rowCount > 0) {
            return ['success' => false, 'message' => 'Property already exists'];
        }

        //for audit logging
        $stmt = $this->pdo->prepare("SET @current_user_id = :current_user_id");
        $stmt->bindParam(":current_user_id", $createdBy);
        $stmt->execute();

        $sql = "INSERT INTO properties (id, name, address1, address2, address3, city, county, postCode, country, managerEmail, telephone, managerName, companyId, createdBy) 
                VALUES (:id, :property_name, :address_line_1, :address_line_2, :address_line_3, :city, :county, :post_code, :country, :email, :telephone, :manager_name, :company_id, :created_by)";

        var_dump($sql);
        var_dump($propertyData);
        $stmt = $this->pdo->prepare($sql);

        $stmt->bindParam(':id', $propertyData['id']);
        $stmt->bindParam(':property_name', $propertyData['name']);
        $stmt->bindParam(':address_line_1', $propertyData['address1']);
        $stmt->bindParam(':address_line_2', $propertyData['address2']);
        $stmt->bindParam(':address_line_3', $propertyData['address3']);
        $stmt->bindParam(':city', $propertyData['city']);
        $stmt->bindParam(':county', $propertyData['county']);
        $stmt->bindParam(':post_code', $propertyData['postCode']);
        $stmt->bindParam(':country', $propertyData['country']);
        $stmt->bindParam(':manager_name', $propertyData['managerName']);
        $stmt->bindParam(':email', $propertyData['managerEmail']);
        $stmt->bindParam(':telephone', $propertyData['telephone']);
        $stmt->bindParam(':company_id', $propertyData['companyId']);
        $stmt->bindParam(':created_by', $createdBy);


        $stmt->execute();

        return ($stmt->rowCount() > 0) ? ['success' => true, 'message' => 'Property created'] : ['success' => false, 'message' => 'Something went wrong'];
    }

    public function getById(string $id): ?array
    {
        $sql = "SELECT id, name, address1, address2, address3, city, county, postCode, country, managerName, managerEmail, telephone, managerName, 
        occupancyType, habitableHeight, buildingHeight, designDate, lifts, communalUtilityAssets, communalGasAppliances,
        meterBank, voidAssets, residentalFlats, uniqueSupplyPoints, commercialUnits, wellMaintained, mitigationPlan, refurbished, 
        refurbishedCDM, oms, managerTelephone, managerAddress, siteEmail, siteTelephone, emergencyName, emergencyEmail, emergencyTelephone, emergencyAddress, 
        localFireName, localFireEmail, localFireTelephone, localFireAddress, localFireDetails, carpark, uniqueReferenceNumber, residentialAwareness, logBook, 
        fireSafetyLogBook, electronicAuditCompleted, epc, energyCertificates, isolationValvesClear, accessControlled, hrbUniqueReferenceNumber, bsrRegistrationNumber,
        principleName, principleEmail, principleTelephone, principleAddress FROM `properties` WHERE id = :id";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result !== false ? $result : null;
    }

    public function update(string $id, array $propertyData, string $updatedBy): array
    {
        //for audit logging
        $stmt = $this->pdo->prepare("SET @current_user_id = :current_user_id");
        $stmt->bindParam(":current_user_id", $updatedBy);
        $stmt->execute();

        // Dynamically build the SET clause for the update statement.
        $setClauses = [];
        $bindings = [];
        foreach ($propertyData as $key => $value) {
            if (is_bool($value)) {
                $value = (int)$value;
            }
            $setClauses[] = "$key = :$key";
            $bindings[":$key"] = $value;
        }

        if (empty($setClauses)) {
            return ['success' => false, 'message' => 'Nothing to update'];
        }
        $sql = "UPDATE properties SET " . implode(', ', $setClauses) . " WHERE id = :id";
        $bindings[':id'] = $id;

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($bindings);

        return ($stmt->rowCount() > 0) ? ['success' => true, 'message' => 'Property updated'] : ['success' => false, 'message' => 'Something went wrong'];
    }

    public function delete(string $id): bool
    {
        $sql = "DELETE FROM properties WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function getPropertiesByTeamIds(array $teamIds): array
    {
        $teamsIds = implode(',', array_fill(0, count($teamIds), "?"));
        $stmt = $this->pdo->prepare("SELECT id, name FROM properties WHERE teamId IN ($teamsIds)");
        $stmt->execute($teamIds);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getPropertyQuestionRequirements(string $propertyId): ?array
    {
        // $sql = "SELECT lifts, communalGasAppliances, meterBank, carpark FROM properties WHERE id = :id";
        $sql = "SELECT lifts FROM properties WHERE id = :id";


        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $propertyId);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result !== false ? $result : null;
    }

    public function getMaintenanceTasks(string $propertyId): array
    {
        $sql = "SELECT mt.id, mt.title, mt.description, mt.typeOfWork, mt.evidence, mt.completedAt, mt.propertyId, mt.createdAt, mc.name, mc.contactName, mc.contactAddress, mc.contactNumber 
        FROM maintenance_tasks mt 
        LEFT JOIN maintenance_companies mc ON mt.completedBy = mc.id 
        WHERE propertyId = :property_id
        ORDER BY createdAt DESC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':property_id', $propertyId);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addMaintenanceTask(array $taskData, string $createdBy): array
    {
        $sql = "INSERT INTO maintenance_tasks (title, description, typeOfWork, propertyId, createdBy) 
                VALUES (:title, :description, :typeOfWork, :propertyId, :created_by)";

        $stmt = $this->pdo->prepare($sql);

        $stmt->bindParam(':title', $taskData['title']);
        $stmt->bindParam(':description', $taskData['description']);
        $stmt->bindParam(':typeOfWork', $taskData['typeOfWork']);
        $stmt->bindParam(':propertyId', $taskData['propertyId']);
        $stmt->bindParam(':created_by', $createdBy);


        $stmt->execute();

        return ($stmt->rowCount() > 0) ? ['success' => true, 'message' => 'Maintenance task created'] : ['success' => false, 'message' => 'Something went wrong'];
    }

    public function completeMaintenanceTask(string $id, array $completedByData, array $completionData): array
    {

        $uuid = Uuid::uuid4()->toString();

        $sql = "INSERT INTO maintenance_companies (id, name, contactName, contactAddress, contactNumber) 
                VALUES (:id, :name, :contactName, :contactAddress, :contactNumber)";

        $stmt = $this->pdo->prepare($sql);

        $stmt->bindParam(':id', $uuid);
        $stmt->bindParam(':name', $completedByData['name']);
        $stmt->bindParam(':contactName', $completedByData['contactName']);
        $stmt->bindParam(':contactAddress', $completedByData['contactAddress']);
        $stmt->bindParam(':contactNumber', $completedByData['contactNumber']);
        $stmt->execute();

        $sql = "UPDATE maintenance_tasks SET completedAt = :completedAt, completedBy = :completedBy, evidence = :evidence WHERE id = :id";

        $stmt = $this->pdo->prepare($sql);

        $stmt->bindParam(':completedAt', $completionData['completedAt']);
        $stmt->bindParam(':completedBy', $uuid);
        $stmt->bindParam(':evidence', $completionData['evidence']);
        $stmt->bindParam(':id', $id);

        $stmt->execute();
        return ($stmt->rowCount() > 0) ? ['success' => true, 'message' => 'Maintenance task completed'] : ['success' => false, 'message' => 'Something went wrong'];
    }

    public function createInitialNotificaitonPreference(string $propertyId): array
    {

        $days = 30;
        $sql = "INSERT INTO notification_preferences (propertyId, daysBeforeExpiry, isActive) 
                VALUES (:property_id, :days_before_expiry, 1)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':property_id', $propertyId);
        $stmt->bindParam(':days_before_expiry', $days);

        $stmt->execute();
        return ($stmt->rowCount() > 0) ? ['success' => true, 'message' => 'Inital notification preference created'] : ['success' => false, 'message' => 'Something went wrong'];
    }

    public function listNotificationPreferences(string $propertyId): array
    {
        $sql = "SELECT daysBeforeExpiry, isActive FROM notification_preferences WHERE propertyId = :property_id ORDER BY daysBeforeExpiry ASC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':property_id', $propertyId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateNotificationPreferences(string $propertyId, array $notificationPreferences): array
    {
        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare("DELETE FROM notification_preferences WHERE propertyId = :property_id");
            $stmt->bindParam(':property_id', $propertyId);
            $stmt->execute();

            if (!empty($notificationPreferences)) {
                $stmt = $this->pdo->prepare("INSERT INTO notification_preferences (propertyId, daysBeforeExpiry, isActive) VALUES (:property_id, :days, 1)");
                foreach ($notificationPreferences as $day) {
                    $stmt->bindParam(':property_id', $propertyId);
                    $stmt->bindParam(':days', $day);
                    $stmt->execute();
                }
            }

            $this->pdo->commit();
            return ['success' => true, 'message' => 'Notification preferences updated successfully.'];
        } catch (Exception $e) {
            $this->pdo->rollback();
            http_response_code(500);
            return ['success' => false, 'message' => 'Failed to update notification preferences.', 'error' => $e->getMessage()];
        }
    }
}
