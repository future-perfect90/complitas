<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Properties.php';


$token = Auth::requireAuth();
$db = (new Database())->connect();
$property = new Properties($db);
$companyId = Validate::ValidateString($_GET['companyId']);

$properties = $property->listAll(companyId: $companyId);

http_response_code(200);
echo json_encode($properties);
