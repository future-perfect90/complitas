<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Compliance.php';

$token = Auth::requireAuth();
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['questionId']) || !isset($data['answer']) || !isset($data['reportId']) || !isset($data['propertyId'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$questionId = Validate::ValidateString($data['questionId']);
$propertyId = Validate::ValidateString($data['propertyId']);
$reportId = Validate::ValidateString($data['reportId']);
$response = match(Validate::ValidateString($data['answer'])) {
    'Yes' => 1,
    'No' => 2,
    'NA' => 3,
    default => null,
};
$fileName = isset($data['fileName']) ? Validate::ValidateString($data['fileName']) : '';
$validUntil = isset($data['validUntil']) ? Validate::ValidateString($data['validUntil']) : NULL;
$dateCompleted = isset($data['dateCompleted']) ? Validate::ValidateString($data['dateCompleted']) : NULL;
$completedBy = $token->{'https://complitas.dev/user_uuid'} ?? 'system';
$database = (new Database())->connect();
$compliance = new Compliance($database);

$result = $compliance->questionResponse($reportId, $propertyId, $questionId, $response, $fileName, $validUntil, $completedBy, $dateCompleted);

if ($result) {
    http_response_code(201);
    echo json_encode(['message' => 'Answer saved successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save answer']);
}
