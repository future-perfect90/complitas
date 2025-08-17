<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/User.php';

$db = (new Database())->connect();
$user = new User($db);
$companyId = $_GET['companyId'];
$inTeam = $_GET['inTeam'] === 'true';

$teamMembers = $user->listTeamMembers($companyId, $inTeam);

http_response_code(200);
echo json_encode($teamMembers);
