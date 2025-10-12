<?php

require_once __DIR__ . '/../../shared/headers.php';

require_once __DIR__ . '/../../classes/Teams.php';
require_once __DIR__ . '/../../classes/User.php';
require_once __DIR__ . '/../../classes/Properties.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/Auth.php';

$token = Auth::requireAuth();
$db = (new Database())->connect();

$userId = $_GET['user_id'] ?? '';
$user = new User($db);
$profileData = $user->getUserProfile($userId);

$response = [
    'success' => true,
    'data' => [
        'profile' => $profileData,
    ]
];
echo json_encode($response);
