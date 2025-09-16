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
    require_once __DIR__ . '/../../classes/Company.php';

    $db = (new Database())->connect();
    $company = new Company($db);

    $companyData = [
        'name' => $data['name'],
        'address1' => $data['address1'] ?? '',
        'address2' => $data['address2'] ?? '',
        'address3' => $data['address3'] ?? '',
        'city' => $data['city'] ?? '',
        'county' => $data['county'] ?? '',
        'postCode' => $data['postCode'] ?? '',
        'country' => $data['country'] ?? '',
        'vatNo' => $data['vatNo'],
        'companyRegNo' => $data['companyRegNo'],
        'email' => $data['email'] ?? '',
        'telephone' => $data['telephone'] ?? '',
        'logo' => $data['logo'] ?? ''
    ];

    $result = $company->create($companyData);

    if (!$result['success']) {
        if ($result['message'] === 'Company already exists') {
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
