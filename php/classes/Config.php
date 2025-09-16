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

    public function auth0Config(): array
    {
        $auth0Domain = $_ENV['VITE_AUTH0_DOMAIN'];

        return [
            'domain' => $_ENV['VITE_AUTH0_DOMAIN'],
            'clientId' => $_ENV['VITE_AUTH0_MACHINE_CLIENT_ID'],
            'clientSecret' => $_ENV['VITE_AUTH0_MACHINE_CLIENT_SECRET'],
            'tokentokenAlgorithm' => 'HS256',
            'audience' => "https://$auth0Domain/api/v2/",
            'grant_type' => 'client_credentials'

        ];
    }
}
