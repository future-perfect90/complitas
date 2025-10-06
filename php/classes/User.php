<?php

use Auth0\SDK\Auth0;
use Auth0\SDK\Configuration\SdkConfiguration;
use Auth0\SDK\Contract\API\ManagementInterface;
use Ramsey\Uuid\Uuid;


require_once(__DIR__ . '/Config.php');
class User
{

    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    private function constuctAuth0(): ManagementInterface
    {
        $auth0config = (new Conf())->auth0Config();
        $config = new SdkConfiguration(
            strategy: 'api',
            domain: $auth0config['domain'],
            clientId: $auth0config['clientId'],
            clientSecret: $auth0config['clientSecret'],
            audience: [$auth0config['audience']],
            scope: ['create:users', 'read:users', 'read:current_user']
        );

        $auth0 = new Auth0($config);
        return $auth0->management();
    }

    public function create(string $name, string $email, string $password, string $companyId, string $createdBy): array
    {
        $lookup = "SELECT count(id) FROM user WHERE email = :email";
        $stmt = $this->pdo->prepare($lookup);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $rowCount = $stmt->fetchColumn();
        if ($rowCount > 0) {
            return ['success' => false, 'message' => 'User already exists'];
        }

        //for audit logging
        $stmt = $this->pdo->prepare("SET @current_user_id = :current_user_id");
        $stmt->bindParam(":current_user_id", $createdBy);
        $stmt->execute();

        $sql = "INSERT INTO user (id, name, email, companyId, createdBy) 
                VALUES (:uuid, :name, :email, :company_id, :created_by)";
        $stmt = $this->pdo->prepare($sql);

        $uuid = Uuid::uuid4()->toString();
        $stmt->bindParam(':uuid', $uuid);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':company_id', $companyId);
        $stmt->bindParam(':created_by', $createdBy);
        $stmt->execute();
        //Add user to auth0
        if ($stmt->rowCount() > 0) {
            $mgmt = $this->constuctAuth0();
            $response = $mgmt->users()->create(
                connection: 'Username-Password-Authentication',
                body: [
                    'name' => $name,
                    'email' => $email,
                    'password' => $password,
                    'email_verified' => false,
                    'app_metadata' => ['companyId' => $companyId, 'uuid' => $uuid],
                ]
            );
        }

        if ($response->getStatusCode() === 201) {
            return ['success' => true, 'message' => 'User created'];
        } else {
            return ['success' => false, 'message' => 'Something went wrong - ' . $response->getStatusCode()];
        }
    }

    public function listAll(?string $companyId = ''): array
    {
        $query = 'SELECT u.id, u.name, u.email, c.name AS company FROM user u JOIN companies c on u.companyId = c.id';
        if (!empty($companyId)) {
            $query .= ' where companyId = :company_id';
        }
        $query .= ' ORDER BY c.name ASC';

        $stmt = $this->pdo->prepare($query);

        if (!empty($companyId)) {
            $stmt->bindParam(':company_id', $companyId);
        }

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
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

    public function getUserProfile(string $userId): array
    {
        $stmt = $this->pdo->prepare("SELECT id, name, email FROM user WHERE id = :user_id");
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
