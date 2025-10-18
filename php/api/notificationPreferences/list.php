<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Properties.php';

$token = Auth::requireAuth();

$propertyId =  Validate::ValidateString($_GET['propertyId']) ?? null;
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
