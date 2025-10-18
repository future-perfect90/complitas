<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Teams.php';

$token = Auth::requireAuth();
$conn = (new Database())->connect();
$teams = new Teams($conn);
$companyId = Validate::ValidateString($_GET['companyId']);
$teamId = Validate::ValidateString($_GET['teamId']) ?? null;

$teamMembers = $teams->listTeamMembers($companyId, $teamId);

http_response_code(200);
echo json_encode($teamMembers);
