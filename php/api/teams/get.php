<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Teams.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/Auth.php';

$auth = new Auth();
$token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION']);
if (empty($token)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}
$database = new Database();
$pdo = $database->connect();
$teams = new Teams($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $teamId = $_GET['id'] ?? null;

    if ($teamId) {
        $team = $teams->getTeam($teamId);
        echo json_encode($team);
    } else {
        echo json_encode(['error' => 'Team ID is required']);
    }
}
