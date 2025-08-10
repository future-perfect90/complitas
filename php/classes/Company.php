<?php

class Company
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Retrieves a list of all companies.
     *
     * @return array An array of company records.
     */
    public function listAll(): array
    {
        $stmt = $this->pdo->query("SELECT id, company_name, address_line_1, address_line_2, address_line_3, city, county, post_code, country, vat_no, company_reg_no, email, telephone FROM companies");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create(array $companyData): array
    {
        $lookup = "SELECT count(id) FROM companies WHERE company_name = :company_name";
        $stmt = $this->pdo->prepare($lookup);
        $stmt->bindParam(':company_name', $companyData['company_name']);
        $stmt->execute();
        $rowCount = $stmt->fetchColumn();
        if($rowCount > 0){
            return ['success' => false, 'message' => 'Company already exists'];
        }

        $sql = "INSERT INTO companies (company_name, address_line_1, address_line_2, address_line_3, city, county, post_code, country, vat_no, company_reg_no, email, telephone) 
                VALUES (:company_name, :address_line_1, :address_line_2, :address_line_3, :city, :county, :post_code, :country, :vat_no, :company_reg_no, :email, :telephone)";
        
        $stmt = $this->pdo->prepare($sql);

        $stmt->bindParam(':company_name', $companyData['company_name']);
        $stmt->bindParam(':address_line_1', $companyData['address_line_1']);
        $stmt->bindParam(':address_line_2', $companyData['address_line_2']);
        $stmt->bindParam(':address_line_3', $companyData['address_line_3']);
        $stmt->bindParam(':city', $companyData['city']);
        $stmt->bindParam(':county', $companyData['county']);
        $stmt->bindParam(':post_code', $companyData['post_code']);
        $stmt->bindParam(':country', $companyData['country']);
        $stmt->bindParam(':vat_no', $companyData['vat_no']);
        $stmt->bindParam(':company_reg_no', $companyData['company_reg_no']);
        $stmt->bindParam(':email', $companyData['email']);
        $stmt->bindParam(':telephone', $companyData['telephone']);
        
        $stmt->execute();

        return ($stmt->rowCount() > 0) ? ['success' => true, 'message' => 'Company created'] : ['success' => false, 'message' => 'Something went wrong'];
    }

    /**
     * Retrieves a single company record by its ID.
     *
     * @param string $id The UUID of the company.
     * @return array|null The company record, or null if not found.
     */
    public function getById(string $id): ?array
    {
        $sql = "SELECT id, company_name, address_line_1, address_line_2, address_line_3, city, county, post_code, country, vat_no, company_reg_no, email, telephone FROM companies WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        $result = $stmt->fetch();
        return $result !== false ? $result : null;
    }

    /**
     * Updates an existing company record.
     *
     * @param string $id The UUID of the company.
     * @param array $companyData An associative array of data to update.
     * @return bool True on success, false on failure.
     */
    public function update(string $id, array $companyData): bool
    {
        // Dynamically build the SET clause for the update statement.
        $setClauses = [];
        $bindings = [];
        foreach ($companyData as $key => $value) {
            $setClauses[] = "'$key' = :$key";
            $bindings[":$key"] = $value;
        }

        if (empty($setClauses)) {
            return false; // Nothing to update.
        }

        $sql = "UPDATE companies SET " . implode(', ', $setClauses) . " WHERE id = :id";
        $bindings[':id'] = $id;

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($bindings);
        
        return $stmt->rowCount() > 0;
    }

    /**
     * Deletes a company record by its ID.
     *
     * @param string $id The UUID of the company.
     * @return bool True on success, false on failure.
     */
    public function delete(string $id): bool
    {
        $sql = "DELETE FROM companies WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }
}
