<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Compliance.php';
require_once __DIR__ . '/../../classes/Database.php';

$database = (new Database())->connect();
$compliance = new Compliance($database);

$areas = $compliance->listAreas();
echo json_encode($areas);
