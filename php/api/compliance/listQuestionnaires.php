<?php

require_once __DIR__ . '/../../classes/Compliance.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../shared/headers.php';

$propertyId = $_GET['propertyId'] ?? '';

if (empty($propertyId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing propertyId']);
    exit;
}
$database = (new Database())->connect();

$compliance = new Compliance($database);
$questionnaires = $compliance->getComplianceQuestionnaires($propertyId);

echo json_encode($questionnaires);