<?php
require_once __DIR__ . '/../../shared/headers.php';


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

$propertyId = $_GET['propertyId'];
$db = (new Database())->connect();
$property = new Properties($db);

$perferences = $property->listNotificationPreferences($propertyId);

if (!empty($perferences)) {
    http_response_code(200);
    echo json_encode($perferences);
} else {
    http_response_code(404);
    $perferences = ['message' => 'No preferences found'];
    echo json_encode($perferences);
}
