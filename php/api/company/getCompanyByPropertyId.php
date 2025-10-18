<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Company.php';

$token = Auth::requireAuth();

$conn = (new Database())->connect();
$company = new Company($conn);
$propertyId = Validate::ValidateString($_GET['propertyId']) ?? null;

if ($propertyId) {
    $result = $company->getCompanyViaPropertyId($propertyId);
    if ($result) {
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode(['message' => 'Company not found']);
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid request, property ID is required']);
}
