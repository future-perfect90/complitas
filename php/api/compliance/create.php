<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Compliance.php';

$token = Auth::requireAuth();

$data = json_decode(file_get_contents("php://input"), true);

$database = (new Database())->connect();
$compliance = new Compliance($database);
$propertyId = Validate::ValidateString($data['propertyId']) ?? '';
$created = $compliance->createComplianceAudit($propertyId);
echo json_encode($created);
