<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once(__DIR__ . '/../../classes/Database.php');
require_once(__DIR__ . '/../../classes/Company.php');

$db = (new Database())->connect();
$company = new Company($db);

$companies = $company->listAll();

if (!empty($companies)) {
    http_response_code(200);
    echo json_encode($companies);
} else {
    http_response_code(404);
    $companies = ['message' => 'No companies found'];
    echo json_encode($companies);
}
