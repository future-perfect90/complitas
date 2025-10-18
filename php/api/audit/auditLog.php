<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Audit.php';

$token = Auth::requireAuth();

$propertyId = Validate::ValidateString($_GET['propertyId']) ?? null;

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
