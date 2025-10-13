<?php

use Ramsey\Uuid\Uuid;

require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Compliance.php';
require_once __DIR__ . '/../../classes/Database.php';

require_once __DIR__ . '/../../classes/Auth.php';

$token = Auth::requireAuth();
$uuid = Uuid::uuid4()->toString();

$data = json_decode(file_get_contents("php://input"), true);

$database = (new Database())->connect();
$compliance = new Compliance($database);
$propertyId = $data['propertyId'] ?? '';
$created = $compliance->createComplianceAudit($propertyId);
echo json_encode($created);
