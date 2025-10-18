<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Teams.php';

$token = Auth::requireAuth();
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {

    $conn = (new Database())->connect();
    $teams = new Teams($conn);

    $name = Validate::ValidateString($data['name']);
    $companyId = Validate::ValidateString($data['companyId']);

    $result = $teams->createTeam($name, $companyId);

    if (!$result['success']) {
        if ($result['message'] === 'Team already exists') {
            http_response_code(409);
            echo json_encode($result);
        } else {
            http_response_code(500);
            echo json_encode($result);
        }
    } else {
        http_response_code(201);
        echo json_encode([$result]);
    }
}
