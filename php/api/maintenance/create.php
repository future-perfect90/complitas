<?php
require_once __DIR__ . '/../../shared/headers.php';

require_once __DIR__ . '/../../classes/Auth.php';

$auth = new Auth();
$token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION']);
if (empty($token)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    require_once __DIR__ . '/../../classes/Database.php';
    require_once __DIR__ . '/../../classes/Properties.php';
    require_once __DIR__ . '/../../classes/Auth.php';

    $auth = new Auth();
    $token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION']);
    if (empty($token)) {
        http_response_code(401);
        echo json_encode(['message' => 'Unauthorized']);
        exit();
    }

    $db = (new Database())->connect();
    $property = new Properties($db);

    $createdBy = $token->{'https://complitas.dev/user_uuid'};

    $result = $property->addMaintenanceTask($data, $createdBy);
    if ($result['success']) {
        http_response_code(201);
        echo json_encode($result);
    } else {
        http_response_code(500);
        echo json_encode($result);
    }
}
