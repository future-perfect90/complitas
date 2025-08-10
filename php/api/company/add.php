<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($data && isset($data['company_name']) && isset($data['vat_no']) && isset($data['company_reg_no'])) {
        require_once(__DIR__ . '/../../classes/Database.php');
        require_once(__DIR__ . '/../../classes/Company.php');

        $db = (new Database())->connect();
        $company = new Company($db);

        $companyData = [
            'company_name' => $data['company_name'],
            'address_line_1' => $data['address_line_1'] ?? '',
            'address_line_2' => $data['address_line_2'] ?? '',
            'address_line_3' => $data['address_line_3'] ?? '',
            'city' => $data['city'] ?? '',
            'county' => $data['county'] ?? '',
            'post_code' => $data['post_code'] ?? '',
            'country' => $data['country'] ?? '',
            'vat_no' => $data['vat_no'],
            'company_reg_no' => $data['company_reg_no'],
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