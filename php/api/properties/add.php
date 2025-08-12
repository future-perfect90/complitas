<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    require_once(__DIR__ . '/../../classes/Database.php');
    require_once(__DIR__ . '/../../classes/Properties.php');

    $db = (new Database())->connect();
    $property = new Properties($db);

    $propertyData = [
        'name' => $data['payload']['name'],
        'address1' => $data['payload']['address1'] ?? '',
        'address2' => $data['payload']['address2'] ?? '',
        'address3' => $data['payload']['address3'] ?? '',
        'city' => $data['payload']['city'] ?? '',
        'county' => $data['payload']['county'] ?? '',
        'postCode' => $data['payload']['postCode'] ?? '',
        'country' => $data['payload']['country'] ?? '',
        'managerName' => $data['payload']['managerName'],
        'email' => $data['payload']['email'] ?? '',
        'telephone' => $data['payload']['telephone'] ?? '',
        'companyId' => $data['companyId']
    ];

    $result = $property->create($propertyData);

    if (!$result['success']) {
        if ($result['message'] === 'Property already exists') {
            http_response_code(409);
            echo json_encode($result);
        } else {
            http_response_code(500);
            echo json_encode($result);
        }
    } else {
        http_response_code(201);
        echo json_encode([$result]);
    }
}
