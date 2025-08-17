<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/Teams.php';

$conn = (new Database())->connect();
$teams = new Teams($conn);

$userId = $_GET['userId'] ?? null;
$teamId = $_GET['teamId'] ?? null;
if ($userId && $teamId) {
    $result = $teams->removeTeamMembers($userId, $teamId);

    http_response_code(200);
    echo json_encode($result);
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid request, User ID and Team ID is required']);
}
