<?php

require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Auth.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/Company.php';

$auth = new Auth();
$token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION']);

if (!$auth->hasRole('SuperAdmin', $token)) {
    http_response_code(403);
    echo json_encode(['message' => 'Forbidden: You do not have access to this resource.']);
    exit();
}

$db = (new Database())->connect();
$company = new Company($db);
$companies = $company->listAll();

if (!empty($companies)) {
    http_response_code(200);
    echo json_encode($companies);
} else {
    http_response_code(200);
    $companies = ['message' => 'No companies found'];
    echo json_encode($companies);
}
