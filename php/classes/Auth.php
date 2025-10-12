<?php

use Firebase\JWT\JWT;
use Firebase\JWT\JWK;
use Auth0\SDK\Auth0;
use Auth0\SDK\Configuration\SdkConfiguration;
use Auth0\SDK\Contract\API\ManagementInterface;

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/Config.php';

class Auth
{

    public function hasRole(string $role, ?object $token = null): bool
    {
        if (!$token) {
            return false;
        }
        $roles = $token->{'https://complitas.dev/roles'};
        return in_array($role, $roles);
    }

    public function validateToken(string $authHeader): ?object
    {
        var_dump($authHeader);
        $parts = explode(' ', $authHeader);
        if (count($parts) !== 2 || strtolower($parts[0]) !== 'bearer') {
            return null;
        }
        $token = $parts[1];
        try {

            $jwksContent = file_get_contents("https://" . $_ENV['VITE_AUTH0_DOMAIN'] . "/.well-known/jwks.json");
            $keys = JWK::parseKeySet(json_decode($jwksContent, true));
            $decodedToken = JWT::decode($token, $keys);
            if ($decodedToken->iss !== "https://{$_ENV['VITE_AUTH0_DOMAIN']}/" || $decodedToken->exp < time() || !in_array($_ENV['VITE_AUTH0_AUDIENCE'], $decodedToken->aud)) {
                return null;
            }
            return $decodedToken;
        } catch (\Throwable $e) {
            error_log("JWT Validation Error: " . $e->getMessage());
            return null;
        }
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

    public function changePassword(string $userId, string $password)
    {
        $mgmt = $this->constuctAuth0();
        $response = $mgmt->users()->update(
            $userId,
            body: [
                'password' => $password,
            ]
        );
        return $response->getStatusCode() === 200 ? ['success' => true, 'message' => 'Password changed'] : ['success' => false, 'message' => 'Something went wrong - ' . $response->getStatusCode()];
    }

    public static function requireAuth(): ?object
    {
        $auth = new self();
        $token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION']);
        var_dump($token);
        if (empty($token)) {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized']);
            exit();
        }
        return $token;
    }
}
