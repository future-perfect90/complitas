<?php

require_once __DIR__ . '/../../shared/headers.php';

require_once __DIR__ . '/../../classes/Teams.php';
require_once __DIR__ . '/../../classes/User.php';
require_once __DIR__ . '/../../classes/Properties.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/Auth.php';

$auth = new Auth();
$token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION']);
if (empty($token)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

$db = (new Database())->connect();

$userId = $_GET['user_id'] ?? '';
$user = new User($db);
$profileData = $user->getUserProfile($userId);

$teams = new Teams($db);
$userTeams = $teams->getMyTeams($userId);

//GET properties which belong to the user's teams
$properties = new Properties($db);
$userProperties = $properties->getPropertiesByTeamIds(array_column($userTeams, 'id'));

$response = [
    'success' => true,
    'data' => [
        'profile' => $profileData,
        'teams' => $userTeams,
        'properties' => $userProperties
    ]
];
echo json_encode($response);
