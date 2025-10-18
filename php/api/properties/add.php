<?php

use Ramsey\Uuid\Uuid;
require_once __DIR__ . '/../../shared/classes.php';

$token = Auth::requireAuth();
$createdBy = $token->{'https://complitas.dev/user_uuid'};
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    require_once __DIR__ . '/../../classes/Properties.php';

    $db = (new Database())->connect();
    $property = new Properties($db);

    $uuid = $uuid = Uuid::uuid4()->toString();
    $propertyData = [
        'id' => $uuid,
        'name' =>  Validate::ValidateString($data['payload']['name']),
        'address1' =>  Validate::ValidateString($data['payload']['address1']) ?? '',
        'address2' =>  Validate::ValidateString($data['payload']['address2']) ?? '',
        'address3' =>  Validate::ValidateString($data['payload']['address3']) ?? '',
        'city' =>  Validate::ValidateString($data['payload']['city']) ?? '',
        'county' =>  Validate::ValidateString($data['payload']['county']) ?? '',
        'postCode' =>  Validate::ValidateString($data['payload']['postCode']) ?? '',
        'country' =>  Validate::ValidateString($data['payload']['country']) ?? '',
        'managerName' =>  Validate::ValidateString($data['payload']['managerName']),
        'managerEmail' =>  Validate::ValidateEmail($data['payload']['managerEmail']) ?? '',
        'telephone' =>  Validate::ValidateString($data['payload']['telephone']) ?? '',
        'companyId' =>  Validate::ValidateString($data['companyId'])
    ];

    $result = $property->create($propertyData, $createdBy);

    if ($result['success']) {
        $result2 = $property->createInitialNotificaitonPreference($uuid);
    }

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
