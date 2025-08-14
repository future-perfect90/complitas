<?php

use Auth0\SDK\Auth0;

require_once(__DIR__ . '/../../vendor/autoload.php');

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();
class Conf
{
    public function DbCredentials(): array
    {
        return [
            'username' => $_ENV['DB_USERNAME'] ?? 'root',
            'password' => $_ENV['DB_PASSWORD'] ?? 'root',
            'dbname' => $_ENV['DB_NAME'] ?? 'complitas',
            'host' => $_ENV['DB_HOST'] ?? 'localhost',
            'port' => $_ENV['DB_PORT'] ?? 8889,
        ];
    }

    public function authenticateToken(string $token)
    {
        $algorithm = 'HS256';
        $config = new \Auth0\SDK\Configuration\SdkConfiguration([
            'domain' => $_ENV['VITE_AUTH0_DOMAIN'],
            'clientId' => $_ENV['VITE_AUTH0_CLIENT_ID'],
            'clientSecret' => $_ENV['VITE_AUTH0_CLIENT_SECRET'],
            'tokenAlgorithm' => $algorithm
        ]);
        $auth0 = new Auth0($config);


        $authorisedToken = new \Auth0\SDK\Token(
            $config,
            $token,
            \Auth0\SDK\Token::TYPE_ID_TOKEN
        );
        $authorisedToken->verify();
        $authorisedToken->validate();
        return $authorisedToken->toArray();
    }
}
