<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once(__DIR__ . '/../../classes/Database.php');
require_once(__DIR__ . '/../../classes/Properties.php');

$db = (new Database())->connect();
$property = new Properties($db);
$companyId = $_GET['companyId'];

$properties = $property->listAll(companyId: $companyId);

if (!empty($properties)) {
    http_response_code(200);
    echo json_encode($properties);
} else {
    http_response_code(404);
    $properties = ['message' => 'No properties found'];
    echo json_encode($properties);
}
