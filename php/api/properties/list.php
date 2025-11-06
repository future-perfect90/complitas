<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Properties.php';


$token = Auth::requireAuth();
$db = (new Database())->connect();
$property = new Properties($db);
$companyId = Validate::ValidateString($_GET['companyId']);
$unassignedOnly = isset($_GET['unassignedOnly']) ? Validate::ValidateBoolean($_GET['unassignedOnly']) : false;
$properties = $property->listAll(companyId: $companyId, unassignedOnly: $unassignedOnly);

http_response_code(200);
echo json_encode($properties);
