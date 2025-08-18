<?php

require_once __DIR__ . '/Conf.php';
class Teams
{

    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function createTeam(string $name, string $companyId): array
    {
        $stmt = $this->pdo->prepare('INSERT INTO teams (name, companyId) VALUES (:name, :company_id)');
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':company_id', $companyId);
        $stmt->execute();
        return $stmt->rowCount() > 0 ?  ['success' => true, 'message' => 'Team created'] :  ['success' => false, 'message' => 'Something went wrong'];
    }

    public function assignToTeam(array $userIds, string $teamId)
    {
        $ids = '';
        foreach ($userIds as $userId) {
            $id = $userId['value'];
            $ids .= "'$id',";
        }
        $ids = rtrim($ids, ',');
        $sql = "UPDATE user SET teamId = :team_id where id IN ($ids)";

        $lookup = "SELECT count(*) FROM user WHERE teamId = :team_id and id IN ($ids)";
        $stmt = $this->pdo->prepare($lookup);
        $stmt->bindParam(':team_id', $teamId);
        $stmt->execute();
        $rowCount = $stmt->fetchColumn();
        if ($rowCount > 0) {
            return ['success' => false, 'message' => 'User exists in team.'];
        }

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':team_id', $teamId);
        $stmt->execute();

        return $stmt->rowCount() > 0 ?  ['success' => true, 'message' => 'User\'s assigned to team'] :  ['success' => false, 'message' => 'Something went wrong'];
    }

    public function listTeams(string $companyId): array
    {
        $stmt = $this->pdo->prepare("SELECT id, name FROM teams where companyId = :company_id");
        $stmt->bindParam(':company_id', $companyId);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listTeamMembers(string $companyId, string | null $teamId): array
    {
        $where = empty($teamId) ? 'teamId IS NULL' : 'teamId = :team_id';
        $sql = "SELECT id, name, email from user where companyId = :company_id AND $where";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':company_id', $companyId);
        !empty($teamId) ? $stmt->bindParam(':team_id', $teamId) : '';
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function removeTeamMembers(string $userId, string $teamId): bool
    {
        $stmt = $this->pdo->prepare("UPDATE user SET teamId = NULL WHERE id = :user_id AND teamId = :team_id");
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':team_id', $teamId);
        return $stmt->execute();
    }

    public function assignTeamToProperty(string $teamId, array $propertyIds): array
    {
        $where = '';
        $insertString = 'INSERT INTO team_properties (teamId, propertyId) VALUES ';
        foreach ($propertyIds as $propertyId) {
            $id = $propertyId['value'];
            $where .= "'$id',";
            $insertString .= "('$teamId', '$id'),";
        }
        $where = rtrim($where, ',');

        $lookup = "SELECT count(*) FROM team_properties WHERE teamId = :team_id AND propertyId IN ($where)";
        $stmt = $this->pdo->prepare($lookup);
        $stmt->bindParam(':team_id', $teamId);
        $stmt->execute();
        $rowCount = $stmt->fetchColumn();
        if ($rowCount > 0) {
            return ['success' => false, 'message' => 'Team already manages property.'];
        }

        $insertString = rtrim($insertString, ',');
        $stmt = $this->pdo->prepare($insertString);
        $stmt->execute();

        return $stmt->rowCount() > 0 ?  ['success' => true, 'message' => 'Team assigned to properties'] :  ['success' => false, 'message' => 'Something went wrong'];
    }
}
