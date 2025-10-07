<?php

require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Compliance.php';
require_once __DIR__ . '/../../classes/Database.php';
require_once __DIR__ . '/../../classes/Auth.php';

$token = Auth::requireAuth();
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['questionId']) || !isset($data['answer']) || !isset($data['reportId'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$questionId = $data['questionId'];
$reportId = $data['reportId'];
switch ($data['answer']) {
    case 'Yes':
        $response = 1;
        break;
    case 'No':
        $response = 2;
        break;
    case 'NA':
        $response = 3;
        break;
    default:
        $response = null;
}
$fileName = $data['fileName'] ?? '';
$validUntil = $data['validUntil'] ?? NULL;
$completedBy = $token->{'https://complitas.dev/user_uuid'} ?? 'system';
$database = (new Database())->connect();
$compliance = new Compliance($database);

$result = $compliance->questionResponse($reportId, $questionId, $response, $fileName, $validUntil, $completedBy);

if ($result) {
    http_response_code(201);
    echo json_encode(['message' => 'Answer saved successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save answer']);
}
