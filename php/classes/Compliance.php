<?php

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
}
