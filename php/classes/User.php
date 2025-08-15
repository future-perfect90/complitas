<?php

use Auth0\SDK\Auth0;
use Auth0\SDK\Configuration\SdkConfiguration;
use Auth0\SDK\Contract\API\ManagementInterface;
use Ramsey\Uuid\Uuid;


require_once(__DIR__ . '/Conf.php');
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

    public function create(string $name, string $email, string $password, string $companyId): array
    {
        $lookup = "SELECT count(id) FROM user WHERE email = :email";
        $stmt = $this->pdo->prepare($lookup);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $rowCount = $stmt->fetchColumn();
        if ($rowCount > 0) {
            return ['success' => false, 'message' => 'User already exists'];
        }

        $sql = "INSERT INTO user (id, name, email, companyId) 
                VALUES (:uuid, :name, :email, :company_id)";
        $stmt = $this->pdo->prepare($sql);

        $uuid = Uuid::uuid4()->toString();
        $stmt->bindParam(':uuid', $uuid);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':company_id', $companyId);
        $stmt->execute();
        $userId = $this->pdo->lastInsertId();
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

    public function listAll(string $companyId): array
    {
        $stmt = $this->pdo->prepare("SELECT id, name, email FROM user where companyId = :company_id");
        $stmt->bindParam(':company_id', $companyId);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
