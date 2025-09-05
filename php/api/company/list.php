<?php

require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/Company.php';

$db = (new Database())->connect();
$company = new Company($db);
$jwt = $_SERVER["HTTP_AUTHORIZATION"];
// $variable = (new Conf())->authenticateToken(token: $jwt);
$companies = $company->listAll();

if (!empty($companies)) {
    http_response_code(200);
    echo json_encode($companies);
} else {
    http_response_code(200);
    $companies = ['message' => 'No companies found'];
    echo json_encode($companies);
}
