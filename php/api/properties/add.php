<?php
require_once __DIR__ . '/../../shared/headers.php';

require_once __DIR__ . '/../../classes/Auth.php';

$auth = new Auth();
$token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION']);
if (empty($token)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    require_once __DIR__ . '/../../classes/Database.php';
    require_once __DIR__ . '/../../classes/Properties.php';

    $db = (new Database())->connect();
    $property = new Properties($db);

    $createdBy = $token->{'https://complitas.dev/user_uuid'};
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

    $result = $property->create($propertyData, $createdBy);

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
