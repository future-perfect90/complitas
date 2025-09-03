<?php

use Ramsey\Uuid\Uuid;

require_once __DIR__ . '/../../vendor/autoload.php';
class Compliance
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function listAll(string $area): array
    {
        $stmt = $this->pdo->prepare("SELECT id, area, question, answerType, uploadRequired FROM compliance_questions WHERE area=:area GROUP BY area");
        $stmt->bindParam(':area', $area);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listAreas(): array
    {
        $stmt = $this->pdo->prepare("SELECT DISTINCT area FROM compliance_questions");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function questionResponse(string $propertyComplianceId, string $questionId, string $answer, string $fileName, string $validUntil, string $completedBy): bool
    {
        $stmt = $this->pdo->prepare("INSERT INTO property_compliance_responses (propertyComplianceId, questionId, answer, fileName, validUntil, completedBy) VALUES (:propertyComplianceId, :questionId, :answer, :fileName, :validUntil, :completedBy)");
        $stmt->bindParam(':propertyComplianceId', $propertyComplianceId);
        $stmt->bindParam(':questionId', $questionId);
        $stmt->bindParam(':answer', $answer);
        $stmt->bindParam(':fileName', $fileName);
        $stmt->bindParam(':validUntil', $validUntil);
        $stmt->bindParam(':completedBy', $completedBy);
        return $stmt->execute();
    }

    public function createComplianceQuestionnaire(string $propertyId): string
    {
        //insert the UUID due to not being able to retun last inserted ID
        $uuid = Uuid::uuid4()->toString();
        $stmt = $this->pdo->prepare("INSERT INTO property_compliance (id, propertyId) VALUES (:id, :propertyId)");
        $stmt->bindParam(':id', $uuid);
        $stmt->bindParam(':propertyId', $propertyId);
        $stmt->execute();
        return $uuid;
    }

    public function getComplianceQuestionnaires(string $propertyId): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM property_compliance WHERE propertyId=:propertyId");
        $stmt->bindParam(':propertyId', $propertyId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getComplianceQuestionnaire(string $id): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM property_compliance WHERE id=:id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
