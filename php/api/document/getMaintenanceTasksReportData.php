<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Document.php';
require_once __DIR__ . '/../../classes/Auth.php';
require_once __DIR__ . '/../../../vendor/autoload.php';

$auth = new Auth();
$token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION'] ?? '');
if (empty($token)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

$propertyId = $_GET['propertyId'] ?? null;

if (!$propertyId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input. Please provide a propertyId.']);
    exit();
}


$pdo = (new Database())->connect();
$document = new Document($pdo);

$results = $document->getMaintenanceTasksReportData($propertyId);
echo json_encode($results);
