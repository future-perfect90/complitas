<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    require_once(__DIR__ . '/../../classes/Database.php');
    require_once(__DIR__ . '/../../classes/Properties.php');
    $db = (new Database())->connect();
    $property = new Properties($db);

    $propertyId = $data['id'];


    $result = $property->update($propertyId, $data['payload']);

    if ($result['success']) {
        http_response_code(204);
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode([$result]);
    }
}
