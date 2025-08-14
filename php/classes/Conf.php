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

    // public function authenticateToken(string $token)
    // {
    //     $algorithm = 'HS256';
    //     $config = new \Auth0\SDK\Configuration\SdkConfiguration([
    //         'domain' => $_ENV['VITE_AUTH0_DOMAIN'],
    //         'clientId' => $_ENV['VITE_AUTH0_CLIENT_ID'],
    //         'clientSecret' => $_ENV['VITE_AUTH0_CLIENT_SECRET'],
    //         'tokenAlgorithm' => $algorithm
    //     ]);
    //     $auth0 = new Auth0($config);


    //     $authorisedToken = new \Auth0\SDK\Token(
    //         $config,
    //         $token,
    //         \Auth0\SDK\Token::TYPE_ID_TOKEN
    //     );
    //     $authorisedToken->verify();
    //     $authorisedToken->validate();
    //     return $authorisedToken->toArray();
    // }

    // public function getAuth0ManagmentToken(): string
    // {
    //     $config = $this->auth0Config();
    //     $auth0Domain = $_ENV['VITE_AUTH0_DOMAIN'];
    //     $tokenRequest = curl_init();
    //     curl_setopt_array($tokenRequest, [
    //         CURLOPT_URL => "https://$auth0Domain/oauth/token",
    //         CURLOPT_RETURNTRANSFER => true,
    //         CURLOPT_POST => true,
    //         CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    //         CURLOPT_POSTFIELDS => json_encode([
    //             'client_id' => $config['clientId'],
    //             'client_secret' => $config['clientSecret'],
    //             'audience' => $config['audience'],
    //             'grant_type' => $config['grant_type']
    //         ])
    //     ]);

    //     $response = curl_exec($tokenRequest);
    //     curl_close($tokenRequest);

    //     $tokenData = json_decode($response, true);
    //     return $tokenData['access_token'];
    // }
}
