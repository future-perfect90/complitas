<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Compliance.php';
require_once __DIR__ . '/../../classes/Properties.php';


$token = Auth::requireAuth();
$propertyId = Validate::ValidateString($_GET['propertyId']) ?? '';
$database = (new Database())->connect();
$property = new Properties($database);

$propertyMetadata = $property->getPropertyQuestionRequirements($propertyId);
$compliance = new Compliance($database);
$questions = $compliance->getComplianceQuestions($propertyMetadata);

echo json_encode($questions);
