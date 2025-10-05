<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/Properties.php';
require_once __DIR__ . '/../../classes/Auth.php';

$token = Auth::requireAuth();

$db = (new Database())->connect();
$property = new Properties($db);

$propertyId = $_GET['propertyId'] ?? null;

if ($propertyId) {
    $result = $property->getMaintenanceTasks($propertyId);
    if ($result) {
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode(['message' => 'Properties not found']);
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid request, property ID is required']);
}
