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
        $where = '';
        foreach ($userIds as $userId) {
            $id = $userId['value'];
            $where .= "'$id',";
        }
        $where = rtrim($where, ',');

        $lookup = "SELECT count(*) FROM team_members WHERE teamId = :team_id AND userId IN ($where)";
        $stmt = $this->pdo->prepare($lookup);
        $stmt->bindParam(':team_id', $teamId);
        $stmt->execute();
        $rowCount = $stmt->fetchColumn();
        if ($rowCount > 0) {
            return ['success' => false, 'message' => 'User exists in team.'];
        }

        $insert = 'INSERT INTO team_members (teamId, userId) VALUES ';
        foreach ($userIds as $userId) {
            $id = $userId['value'];
            $insert .= "('$teamId', '$id'),";
        }
        $insert = rtrim($insert, ',');
        $stmt = $this->pdo->prepare($insert);
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

    public function listTeamMembers(string $companyId, bool $inTeam = false): array
    {
        $sql = $inTeam ? 'ut.teamId IS NOT NULL' : 'ut.teamId IS NULL';
        $stmt = $this->pdo->prepare("SELECT u.id, u.name, u.email FROM user u LEFT JOIN team_members ut ON u.id = ut.userId WHERE u.companyId = :company_id AND $sql");
        $stmt->bindParam(':company_id', $companyId);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function removeTeamMembers(string $userId, string $teamId): bool
    {
        $stmt = $this->pdo->prepare("DELETE FROM team_members WHERE userId = :user_id AND teamId = :team_id");
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':team_id', $teamId);
        return $stmt->execute();
    }

    public function assignTeamToProperty(string $teamId, string $propertyId): array
    {
        $stmt = $this->pdo->prepare('INSERT INTO team_properties (teamId, propertyId) VALUES (:team_id, :property_id');
        $stmt->bindParam(':team_id', $teamId);
        $stmt->bindParam(':property_id', $propertyId);
        $stmt->execute();
        return $stmt->rowCount() > 0 ?  ['success' => true, 'message' => 'Property assigned to team'] :  ['success' => false, 'message' => 'Something went wrong'];
    }
}
