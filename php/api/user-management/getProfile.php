<?php

require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/User.php';

$token = Auth::requireAuth();
$db = (new Database())->connect();

$userId = Validate::ValidateString($_GET['user_id']) ?? '';
$user = new User($db);
$profileData = $user->getUserProfile($userId);

$response = [
    'success' => true,
    'data' => [
        'profile' => $profileData,
    ]
];
echo json_encode($response);
