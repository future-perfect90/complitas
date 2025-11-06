<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/User.php';

$token = Auth::requireAuth();
$conn = (new Database())->connect();
$property = new Properties($conn);
$companyId = Validate::ValidateString($_GET['companyId']);
$userId = Validate::ValidateString($_GET['userId']) ?? null;

$properties = $property->listAssignedProperties($companyId, $userId);

if (!empty($properties)) {
    http_response_code(200);
    echo json_encode($properties);
} else {
    http_response_code(200);
    $properties = ['message' => 'No properties found'];
    echo json_encode($properties);
}
