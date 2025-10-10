<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Audit.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/Auth.php';
require_once __DIR__ . '/../../../vendor/autoload.php';
var_dump($_SERVER);
$token = Auth::requireAuth();

$propertyId = $_GET['propertyId'] ?? null;

$pdo = (new Database())->connect();
$audit = new Audit($pdo);

$responseAuditLog = $audit->getResponseAuditLog($propertyId);
$propertyAuditLog = $audit->getPropertyAuditLog($propertyId);

$result = [
    'responseLog' => $responseAuditLog,
    'propertyLog' => $propertyAuditLog
];


http_response_code(200);
echo json_encode($result);
