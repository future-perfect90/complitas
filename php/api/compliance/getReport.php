<?php

require_once __DIR__ . '/../../classes/Compliance.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../shared/headers.php';

require_once __DIR__ . '/../../classes/Auth.php';

$token = Auth::requireAuth();

$propertyId = $_GET['id'] ?? '';

if (empty($propertyId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing propertyId']);
    exit;
}
$database = (new Database())->connect();
$compliance = new Compliance($database);
$reports = $compliance->getComplianceReports($propertyId);

echo json_encode($reports);
