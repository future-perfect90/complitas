<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Properties.php';


$token = Auth::requireAuth();

$db = (new Database())->connect();
$property = new Properties($db);

$propertyId = Validate::ValidateString($_GET['propertyId']) ?? null;

if ($propertyId) {
    $result = $property->getMaintenanceTasks($propertyId);
    http_response_code(200);
    echo json_encode($result);
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid request, property ID is required']);
}
