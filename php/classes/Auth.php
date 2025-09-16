<?php

use Firebase\JWT\JWT;
use Firebase\JWT\JWK;

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

    function validateToken(string $authHeader): ?object
    {
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
}
