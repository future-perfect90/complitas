<?php

require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Compliance.php';
require_once __DIR__ . '/../../classes/Database.php';

header('Content-Type: application/json');

$database = (new Database())->connect();
$compliance = new Compliance($database);

$area = $_GET['area'] ?? '';
$questions = $compliance->listAll($area);
echo json_encode($questions);
