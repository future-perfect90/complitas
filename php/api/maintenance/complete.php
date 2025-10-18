<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Properties.php';

$token = Auth::requireAuth();
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {

    $db = (new Database())->connect();
    $property = new Properties($db);

    $maintenanceId = Validate::ValidateString($data['id']) ?? null;

    $completedByData = [
        'name' => Validate::ValidateString($data['payload']['name']),
        'contactName' => Validate::ValidateString($data['payload']['contactName']),
        'contactAddress' => Validate::ValidateString($data['payload']['contactAddress']),
        'contactNumber' => Validate::ValidateString($data['payload']['contactNumber'])
    ];

    $maintenanceData = [
        'completedAt' => date('Y-m-d H:i:s'),
        'evidence' => Validate::ValidateString($data['payload']['evidence']) ?? null,
        'propertyId' => Validate::ValidateString($data['payload']['propertyId']) ?? null,
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
