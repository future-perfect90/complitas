<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Document.php';
require_once __DIR__ . '/../../classes/Auth.php';
require_once __DIR__ . '/../../../vendor/autoload.php';

$token = Auth::requireAuth();

$reportId = $_GET['reportId'] ?? null;

if (!$reportId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input. Please provide a reportId.']);
    exit();
}


$pdo = (new Database())->connect();
$document = new Document($pdo);

$results = $document->getReportData($reportId);
echo json_encode($results);
