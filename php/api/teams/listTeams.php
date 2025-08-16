<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/User.php';

$db = (new Database())->connect();
$user = new User($db);
$companyId = $_GET['companyId'];

$teams = $user->listTeams($companyId);

if (!empty($teams)) {
    http_response_code(200);
    echo json_encode($teams);
} else {
    http_response_code(404);
    $teams = ['message' => 'No users found'];
    echo json_encode($teams);
}
