<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/User.php';
require_once __DIR__ . '/../../classes/Auth.php';

$auth = new Auth();
$token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION']);
if (empty($token)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}
$companyId = '';
$superAdmin = $auth->hasRole('SuperAdmin', $token);
if (!$superAdmin) {
    $companyId = $_GET['companyId'];
    if (empty($companyId)) {
        http_response_code(401);
        echo json_encode(['message' => 'Company ID should be supplied']);
        exit();
    }
}

$db = (new Database())->connect();
$user = new User($db);


$users = $user->listAll(companyId: $companyId);

if (!empty($users)) {
    http_response_code(200);
    echo json_encode($users);
} else {
    http_response_code(404);
    $users = ['message' => 'No users found'];
    echo json_encode($users);
}
