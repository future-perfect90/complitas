<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Properties.php';

$token = Auth::requireAuth();
$conn = (new Database())->connect();
$property = new Properties($conn);

$propertyId = Validate::ValidateString($_GET['id']) ?? null;
if ($propertyId) {
    $result = $property->delete($propertyId);

    http_response_code(200);
    echo json_encode($result);
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid request, property ID is required']);
}
