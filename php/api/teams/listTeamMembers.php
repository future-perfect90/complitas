<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/Teams.php';

$conn = (new Database())->connect();
$teams = new Teams($conn);
$companyId = $_GET['companyId'];
$inTeam = $_GET['inTeam'] === 'true';

$teamMembers = $teams->listTeamMembers($companyId, $inTeam);

http_response_code(200);
echo json_encode($teamMembers);
