<?php

require_once __DIR__ . '/../../classes/Compliance.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../shared/headers.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // A preflight request doesn't need a body, just a 200 OK status
    http_response_code(200);
    exit();
}
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
