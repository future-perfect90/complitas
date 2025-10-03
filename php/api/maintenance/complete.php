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

    $db = (new Database())->connect();
    $property = new Properties($db);

    $maintenanceId = $data['id'] ?? null;

    $completedByData = [
        'name' => $data['payload']['name'],
        'contactName' => $data['payload']['contactName'],
        'contactAddress' => $data['payload']['contactAddress'],
        'contactNumber' => $data['payload']['contactNumber']
    ];

    $maintenanceData = [
        'completedAt' => date('Y-m-d H:i:s'),
        'evidence' => $data['payload']['evidence'] ?? null,
        'propertyId' => $data['payload']['propertyId'] ?? null,
    ];
    $result = $property->completeMaintenanceTask($maintenanceId, $completedByData, $maintenanceData);
    if ($result['success']) {
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(500);
        echo json_encode($result);
    }
}
