<?php

class Audit
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function getPropertyAuditLog(string $propertyId): array
    {
        $sql = "SELECT al.propertyId, al.timestamp, al.actionType, al.oldValue, al.newValue, u.name as actionedBy, al.fieldName 
                FROM `audit_log` al 
                JOIN user u ON u.id=al.performingUserId
                WHERE al.propertyId = :propertyId and al.tableName = 'properties'
                ORDER BY al.timestamp ASC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':propertyId', $propertyId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getResponseAuditLog(string $propertyId): array
    {
        $sql = "SELECT al.propertyId, al.timestamp, al.actionType, al.oldValue, al.newValue, u.name as actionedBy, cq.question, cq.area, al.fieldName FROM `audit_log` al
                JOIN question_responses qr on al.recordId=qr.id
                JOIN compliance_questions cq ON cq.id=qr.questionId
                JOIN user u ON u.id=al.performingUserId
                WHERE al.propertyId = :propertyId and al.tableName = 'question_responses'
                ORDER BY al.timestamp, cq.area, al.fieldName ASC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':propertyId', $propertyId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
