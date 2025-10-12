<?php
require_once __DIR__ . '/../../shared/headers.php';


require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/Properties.php';
require_once __DIR__ . '/../../classes/Auth.php';

$token = Auth::requireAuth();
$db = (new Database())->connect();
$property = new Properties($db);
$companyId = $_GET['companyId'];

$properties = $property->listAll(companyId: $companyId);

http_response_code(200);
echo json_encode($properties);
