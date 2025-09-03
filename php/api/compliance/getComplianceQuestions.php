<?php

require_once __DIR__ . '/../../classes/Compliance.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../shared/headers.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // A preflight request doesn't need a body, just a 200 OK status
    http_response_code(200);
    exit();
}

$database = (new Database())->connect();
$compliance = new Compliance($database);
$questions = $compliance->getComplianceQuestions();

echo json_encode($questions);
