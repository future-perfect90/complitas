<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Compliance.php';

$token = Auth::requireAuth();
$propertyComplianceId = Validate::ValidateString($_GET['propertyComplianceId']) ?? '';
$database = (new Database())->connect();
$compliance = new Compliance($database);

$result = $compliance->getAnswers($propertyComplianceId);

http_response_code(200);
echo json_encode($result);
