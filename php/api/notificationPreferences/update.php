<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Properties.php';
require_once __DIR__ . '/../../classes/Database.php';
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
$data = json_decode(file_get_contents('php://input'), true);

var_dump($data);
$propertyId = $data['propertyId'] ?? null;
$days = $data['days'] ?? [];

if (!$propertyId) {
    http_response_code(400);
    echo json_encode(['message' => 'Property ID is required.']);
    exit;
}

$result = $property->updateNotificationPreferences($propertyId, $days);
var_dump($result);
if ($result['success']) {
    http_response_code(204);
    echo json_encode($result);
} else {
    http_response_code(400);
    echo json_encode([$result]);
}
