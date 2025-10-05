<?php


require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Compliance.php';
require_once __DIR__ . '/../../classes/Database.php';

require_once __DIR__ . '/../../classes/Auth.php';

$token = Auth::requireAuth();
$propertyComplianceId = $_GET['propertyComplianceId'] ?? '';
$database = (new Database())->connect();
$compliance = new Compliance($database);

$result = $compliance->getAnswers($propertyComplianceId);

http_response_code(200);
echo json_encode($result);
