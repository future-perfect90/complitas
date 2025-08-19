<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/Teams.php';

$conn = (new Database())->connect();
$teams = new Teams($conn);
$companyId = $_GET['companyId'];
$teamId = !empty($_GET['teamId']) ? $_GET['teamId'] : null;

$teams = $teams->listTeamProperties($companyId, $teamId);

if (!empty($teams)) {
    http_response_code(200);
    echo json_encode($teams);
} else {
    http_response_code(200);
    $teams = ['message' => 'No properties found'];
    echo json_encode($teams);
}
