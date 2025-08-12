<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // if ($data && isset($data['company_name']) && isset($data['vat_no']) && isset($data['company_reg_no'])) {
    if($data) {
        require_once(__DIR__ . '/../../classes/Database.php');
        require_once(__DIR__ . '/../../classes/Company.php');

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
            'telephone' => $data['telephone'] ?? ''
        ];

        $result = $company->create($companyData);

        if(!$result['success']) {
            if($result['message'] === 'Company already exists') {
                http_response_code(409);
                echo json_encode($result);
            }
            else {
                http_response_code(500);
                echo json_encode($result);
            }
        } else {
            http_response_code(201);
            echo json_encode([$result]);
        }
    } else {
        http_response_code(405); // Method Not Allowed
        echo json_encode(['errors' => 'Method not allowed']);
    }
}