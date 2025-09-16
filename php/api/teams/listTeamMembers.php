<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/Teams.php';
require_once __DIR__ . '/../../classes/Auth.php';

$auth = new Auth();
$token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION']);
if (empty($token)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}
$conn = (new Database())->connect();
$teams = new Teams($conn);
$companyId = $_GET['companyId'];
$teamId = !empty($_GET['teamId']) ? $_GET['teamId'] : null;

$teamMembers = $teams->listTeamMembers($companyId, $teamId);

http_response_code(200);
echo json_encode($teamMembers);
