<?php

require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/Company.php';
require_once __DIR__ . '/../../shared/headers.php';

require_once __DIR__ . '/../../classes/Auth.php';

$auth = new Auth();
$token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION']);
if (empty($token)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

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
