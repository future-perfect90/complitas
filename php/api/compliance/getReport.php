<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Compliance.php';

$token = Auth::requireAuth();

$propertyId = Validate::ValidateString($_GET['id']) ?? '';

if (empty($propertyId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing propertyId']);
    exit;
}
$database = (new Database())->connect();
$compliance = new Compliance($database);
$reports = $compliance->getComplianceReports($propertyId);

echo json_encode($reports);
