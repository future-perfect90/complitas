<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Document.php';

$token = Auth::requireAuth();

$propertyId = Validate::ValidateString($_GET['propertyId']) ?? null;

if (!$propertyId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input. Please provide a propertyId.']);
    exit();
}


$pdo = (new Database())->connect();
$document = new Document($pdo);

$results = $document->getMaintenanceTasksReportData($propertyId);
echo json_encode($results);
