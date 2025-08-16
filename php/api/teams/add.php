<?php
require_once(__DIR__ . '/../../shared/headers.php');

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    require_once(__DIR__ . '/../../classes/Database.php');
    require_once(__DIR__ . '/../../classes/User.php');

    $db = (new Database())->connect();
    $user = new User($db);

    $name = $data['name'];
    $companyId = $data['companyId'];

    $result = $user->createTeam($name, $companyId);

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
