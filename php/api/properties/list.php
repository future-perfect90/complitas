<?php
require_once __DIR__ . '/../../shared/headers.php';


require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/Properties.php';
require_once __DIR__ . '/../../classes/Auth.php';

$auth = new Auth();
$token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION']);
if (empty($token)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

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
