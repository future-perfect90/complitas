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

    public function questionResponse(string $reportId, string $questionId, string $answer, string $fileName, string $validUntil, string $completedBy): bool
    {
        $stmt = $this->pdo->prepare("INSERT INTO question_responses (reportId, questionId, answer, fileName, validUntil, completedBy) VALUES (:propertyComplianceId, :questionId, :answer, :fileName, :validUntil, :completedBy) 
        ON DUPLICATE KEY UPDATE answer = VALUES(answer), fileName = VALUES(fileName), validUntil = VALUES(validUntil), completedBy = VALUES(completedBy)");
        $stmt->bindParam(':propertyComplianceId', $reportId);
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
        $stmt = $this->pdo->prepare("INSERT INTO reports (id, propertyId) VALUES (:id, :propertyId)");
        $stmt->bindParam(':id', $uuid);
        $stmt->bindParam(':propertyId', $propertyId);
        $stmt->execute();
        return $uuid;
    }

    public function getComplianceQuestionnaires(string $propertyId): array
    {
        $stmt = $this->pdo->prepare("SELECT id, propertyId FROM reports WHERE propertyId=:propertyId");
        $stmt->bindParam(':propertyId', $propertyId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getComplianceQuestions(array $propertyMetadata): array
    {
        $conditionalColumns = [
            'lifts' => 'hasLifts',
            'communalUtilityAssets' => 'hasCommunalAssets',
            'communalGasAppliances' => 'hasCommunalGas',
            'carpark' => 'hasBasementCarpark',
            'voidAssets' => 'hasVoids',
        ];

        $whereClauses = ['1'];

        foreach ($conditionalColumns as $propertyColumn => $questionColumn) {

            $baseCondition = "$questionColumn = 0 OR $questionColumn IS NULL";

            if (!empty($propertyMetadata[$propertyColumn])) {
                $whereClauses[] = "($baseCondition OR $questionColumn = 1)";
            } else {
                $whereClauses[] = "($baseCondition)";
            }
        }

        $sql = "SELECT id, area, question, answerType, uploadRequired FROM compliance_questions WHERE " . implode(' AND ', $whereClauses);
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAnswers(string $propertyComplianceId): array
    {
        $stmt = $this->pdo->prepare("SELECT id, reportId, questionId, CASE answer
        WHEN 1 THEN 'Yes'
        WHEN 2 THEN 'No'
        WHEN 3 THEN 'NA'
        ELSE NULL
        END AS answer, fileName, validUntil, completedBy FROM question_responses WHERE reportId=:propertyComplianceId");
        $stmt->bindParam(':propertyComplianceId', $propertyComplianceId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
