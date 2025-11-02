<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Compliance.php';

$token = Auth::requireAuth();
$parentQuestionId = Validate::ValidateString($_GET['parentQuestionId']) ?? '';
$database = (new Database())->connect();

$compliance = new Compliance($database);
$questions = $compliance->getChildQuestions($parentQuestionId);

echo json_encode($questions);
