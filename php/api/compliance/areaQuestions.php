<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Compliance.php';

$token = Auth::requireAuth();
$database = (new Database())->connect();
$compliance = new Compliance($database);

$area = Validate::ValidateString($_GET['area']) ?? '';
$questions = $compliance->listAll($area);
echo json_encode($questions);
