<?php

class Audit
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function getAuditLog(string $propertyId): array
    {
        $sql = "SELECT al.property_id, al.timestamp, al.action_type, al.old_value, al.new_value, u.name, cq.question, cq.area FROM `audit_log` al
                JOIN question_responses qr on al.record_id=qr.id
                JOIN compliance_questions cq ON cq.id=qr.questionId
                JOIN user u ON u.id=al.performing_user_id
                WHERE al.property_id = :propertyId
                ORDER BY al.timestamp ASC;";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':propertyId', $propertyId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
