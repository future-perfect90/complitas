<?php
use Ramsey\Uuid\Uuid;
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Compliance.php';
require_once __DIR__ . '/../../classes/Database.php';

//insert the UUID due to not being able to retun last inserted ID
$uuid = Uuid::uuid4()->toString();

$data = json_decode(file_get_contents("php://input"), true);

$database = (new Database())->connect();
$compliance = new Compliance($database);
$propertyId = $data['propertyId'] ?? '';
$created = $compliance->createComplianceQuestionnaire($propertyId);
echo json_encode($created);
