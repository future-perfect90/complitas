<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Company.php';

$token = Auth::requireAuth();
$auth = new Auth();

if (!$auth->hasRole('SuperAdmin', $token)) {
    http_response_code(403);
    echo json_encode(['message' => 'Forbidden: You do not have access to this resource.']);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {

    $db = (new Database())->connect();
    $company = new Company($db);

    $companyData = [
        'name' => Validate::ValidateString($data['name']),
        'address1' => Validate::ValidateString($data['address1']) ?? '',
        'address2' => Validate::ValidateString($data['address2']) ?? '',
        'address3' => Validate::ValidateString($data['address3']) ?? '',
        'city' => Validate::ValidateString($data['city']) ?? '',
        'county' => Validate::ValidateString($data['county']) ?? '',
        'postCode' => Validate::ValidateString($data['postCode']) ?? '',
        'country' => Validate::ValidateString($data['country']) ?? '',
        'vatNo' => Validate::ValidateString($data['vatNo']),
        'companyRegNo' => Validate::ValidateString($data['companyRegNo']),
        'email' => Validate::ValidateEmail($data['email']) ?? '',
        'telephone' => Validate::ValidateString($data['telephone']) ?? '',
        'logo' => Validate::ValidateString($data['logo']) ?? ''
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
