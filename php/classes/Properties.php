<?php

class Properties
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function listAll(string $companyId): array
    {
        $stmt = $this->pdo->prepare("SELECT id, name, address1, address2, address3, city, county, postCode, country, email, telephone, managerName FROM properties where companyId = :company_id");
        $stmt->bindParam(':company_id', $companyId);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create(array $propertyData): array
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

        $sql = "INSERT INTO properties (name, address1, address2, address3, city, county, postCode, country, email, telephone, managerName, companyId) 
                VALUES (:property_name, :address_line_1, :address_line_2, :address_line_3, :city, :county, :post_code, :country, :email, :telephone, :manager_name, :company_id)";

        $stmt = $this->pdo->prepare($sql);

        $stmt->bindParam(':property_name', $propertyData['name']);
        $stmt->bindParam(':address_line_1', $propertyData['address1']);
        $stmt->bindParam(':address_line_2', $propertyData['address2']);
        $stmt->bindParam(':address_line_3', $propertyData['address3']);
        $stmt->bindParam(':city', $propertyData['city']);
        $stmt->bindParam(':county', $propertyData['county']);
        $stmt->bindParam(':post_code', $propertyData['postCode']);
        $stmt->bindParam(':country', $propertyData['country']);
        $stmt->bindParam(':manager_name', $propertyData['managerName']);
        $stmt->bindParam(':email', $propertyData['email']);
        $stmt->bindParam(':telephone', $propertyData['telephone']);
        $stmt->bindParam(':company_id', $propertyData['companyId']);

        $stmt->execute();

        return ($stmt->rowCount() > 0) ? ['success' => true, 'message' => 'Property created'] : ['success' => false, 'message' => 'Something went wrong'];
    }

    public function getById(string $id): ?array
    {
        $sql = "SELECT id, name, address1, address2, address3, city, county, postCode, country, managerName, email, telephone FROM properties WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result !== false ? $result : null;
    }

    public function update(string $id, array $propertyData): array
    {
        // Dynamically build the SET clause for the update statement.
        $setClauses = [];
        $bindings = [];
        foreach ($propertyData as $key => $value) {
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
}
