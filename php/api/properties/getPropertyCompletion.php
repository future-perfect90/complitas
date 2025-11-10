<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Properties.php';

$token = Auth::requireAuth();
$conn = (new Database())->connect();
$property = new Properties($conn);
$companyId = Validate::ValidateString($_GET['companyId']);
$userId = Validate::ValidateString($_GET['userId']) ?? null;

if ($companyId && $userId) {
    $result = $property->getPropertyCompletion($userId, $companyId);
    http_response_code(200);
    echo json_encode($result);
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid request, company ID and user ID is required']);
}
