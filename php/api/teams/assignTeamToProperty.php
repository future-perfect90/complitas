<?php
require_once __DIR__ . '/../../shared/headers.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    require_once __DIR__ . '/../../classes/Database.php';
    require_once __DIR__ . '/../../classes/Properties.php';

    $db = (new Database())->connect();
    $user = new Properties($db);

    $propertyId = $data['propertyId'];
    $teamId = $data['teamId'];

    $result = $user->assignTeamToProperty($teamId, $propertyId);

    if (!$result['success']) {
        http_response_code(500);
        echo json_encode($result);
    } else {
        http_response_code(201);
        echo json_encode([$result]);
    }
}
