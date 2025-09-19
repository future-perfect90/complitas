<?php
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../../classes/Document.php';
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Auth.php';

$auth = new Auth();
$token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION'] ?? '');
if (empty($token)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

$reportId = $_GET['reportId'] ?? null;

if ($reportId) {
    $document = new Document();
    $document->createReport($reportId);
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input. Please provide a reportId.']);
}
