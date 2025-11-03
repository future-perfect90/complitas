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

    public function questionResponse(string $reportId, string $propertyId, string $questionId, string $answer, string $fileName, string $completedBy, string|null $savedDate): bool
    {

        //for audit logging
        $stmt = $this->pdo->prepare("SET @current_user_id = :current_user_id");
        $stmt->bindParam(":current_user_id", $completedBy);
        $stmt->execute();
        $sql = "INSERT INTO question_responses (reportId, propertyId, questionId, answer, fileName, completedBy, savedDate) 
        VALUES (:reportId, :propertyId, :questionId, :answer, :fileName, :completedBy, :savedDate)
        ON DUPLICATE KEY UPDATE 
        answer = VALUES(answer), 
        fileName = VALUES(fileName), 
        completedBy = VALUES(completedBy),
        savedDate = VALUES(savedDate)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':reportId', $reportId);
        $stmt->bindParam(':propertyId', $propertyId);
        $stmt->bindParam(':questionId', $questionId);
        $stmt->bindParam(':answer', $answer);
        $stmt->bindParam(':fileName', $fileName);
        $stmt->bindParam(':completedBy', $completedBy);
        $stmt->bindParam(':savedDate', $savedDate);
        return $stmt->execute();
    }

    public function createComplianceAudit(string $propertyId): string
    {
        //insert the UUID due to not being able to retun last inserted ID
        $uuid = Uuid::uuid4()->toString();
        $stmt = $this->pdo->prepare("INSERT INTO reports (id, propertyId) VALUES (:id, :propertyId)");
        $stmt->bindParam(':id', $uuid);
        $stmt->bindParam(':propertyId', $propertyId);
        $stmt->execute();
        return $uuid;
    }

    public function getComplianceReports(string $propertyId): array
    {
        $stmt = $this->pdo->prepare("SELECT id, propertyId, createdAt FROM reports WHERE propertyId=:propertyId ORDER BY createdAt DESC");
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
            'isHRB' => 'isHRB',
        ];

        $whereClauses = ['byDefault = 1'];

        foreach ($conditionalColumns as $propertyColumn => $questionColumn) {
            if (!empty($propertyMetadata[$propertyColumn])) {
                $whereClauses[] = "$questionColumn = 1";
            }
        }

        $sql = "SELECT cq.id, ca.area, cq.question, cq.answerType, cq.possibleAnswers, cq.uploadRequired, cq.dateType, cq.triggerAnswer, cq.parentQuestionId FROM compliance_questions cq 
        LEFT JOIN compliance_area ca ON cq.area = ca.id WHERE " . implode(' OR ', $whereClauses) . " ORDER BY ca.displayOrder";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAnswers(string $propertyComplianceId): array
    {
        $stmt = $this->pdo->prepare("SELECT id, reportId, questionId, answer, fileName, completedBy, savedDate FROM question_responses WHERE reportId=:propertyComplianceId");
        $stmt->bindParam(':propertyComplianceId', $propertyComplianceId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getChildQuestions(string $parentQuestionId): array
    {
        $stmt = $this->pdo->prepare("SELECT id, area, question, answerType, uploadRequired, dateType, triggerAnswer FROM compliance_questions WHERE parentQuestionId=:parentQuestionId");
        $stmt->bindParam(':parentQuestionId', $parentQuestionId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getExpiringCerts(string $companyId): array
    {
        $sql = "SELECT 
                    p.id as propertyId, 
                    p.name as propertyName, 
                    DATE_FORMAT(qr.savedDate,'%d-%m-%Y') AS expiryDate,
                    cq.question, 
                    ca.area,
                    r.id as auditId
                FROM properties p
                JOIN reports r ON r.propertyId = p.id
                JOIN question_responses qr ON qr.reportId = r.id
                JOIN compliance_questions cq ON qr.questionId = cq.id
                JOIN compliance_area ca ON cq.area = ca.id
                WHERE p.companyId = :companyId
                AND qr.answer = 'Yes' AND cq.dateType = 'Valid until'
                AND qr.savedDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 MONTH)
                ORDER BY p.id, ca.displayOrder, qr.savedDate ASC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':companyId', $companyId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
