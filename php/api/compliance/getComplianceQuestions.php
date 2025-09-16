<?php

require_once __DIR__ . '/../../classes/Compliance.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/Properties.php';
require_once __DIR__ . '/../../shared/headers.php';

require_once __DIR__ . '/../../classes/Auth.php';

$auth = new Auth();
$token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION']);
if (empty($token)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}
$propertyId = $_GET['propertyId'] ?? '';
$database = (new Database())->connect();
$property = new Properties($database);

$propertyMetadata = $property->getPropertyQuestionRequirements($propertyId);
$compliance = new Compliance($database);
$questions = $compliance->getComplianceQuestions($propertyMetadata);

echo json_encode($questions);
