<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Teams.php';

$token = Auth::requireAuth();
$database = new Database();
$pdo = $database->connect();
$teams = new Teams($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $teamId = Validate::ValidateString($_GET['id']) ?? null;

    if ($teamId) {
        $team = $teams->getTeam($teamId);
        echo json_encode($team);
    } else {
        echo json_encode(['error' => 'Team ID is required']);
    }
}
