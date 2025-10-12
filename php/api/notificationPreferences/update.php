<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Properties.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/Auth.php';

$token = Auth::requireAuth();

$db = (new Database())->connect();
$property = new Properties($db);
$data = json_decode(file_get_contents('php://input'), true);

$propertyId = $data['propertyId'] ?? null;
$days = $data['days'] ?? [];

if (!$propertyId) {
    http_response_code(400);
    echo json_encode(['message' => 'Property ID is required.']);
    exit;
}

$result = $property->updateNotificationPreferences($propertyId, $days);
if ($result['success']) {
    http_response_code(204);
    echo json_encode($result);
} else {
    http_response_code(400);
    echo json_encode([$result]);
}
