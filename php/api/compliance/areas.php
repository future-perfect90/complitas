<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Compliance.php';
require_once __DIR__ . '/../../classes/Database.php';

require_once __DIR__ . '/../../classes/Auth.php';

$token = Auth::requireAuth();
$database = (new Database())->connect();
$compliance = new Compliance($database);

$areas = $compliance->listAreas();
echo json_encode($areas);
