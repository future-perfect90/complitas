<?php

require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/Properties.php';
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Auth.php';

$token = Auth::requireAuth();
$conn = (new Database())->connect();
$property = new Properties($conn);

$propertyId = $_GET['id'] ?? null;
if ($propertyId) {
    $result = $property->delete($propertyId);

    http_response_code(200);
    echo json_encode($result);
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid request, property ID is required']);
}
