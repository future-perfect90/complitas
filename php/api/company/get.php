<?php

require_once(__DIR__ . '/../../classes/Database.php');
require_once(__DIR__ . '/../../classes/Company.php');

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
$conn = (new Database())->connect();
$company = new Company($conn);
$companyId = $_GET['id'] ?? null;

if ($companyId) {
    $result = $company->getById($companyId);
    if ($result) {
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode(['message' => 'Company not found']);
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid request, company ID is required']);
}
