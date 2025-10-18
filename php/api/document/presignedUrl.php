<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Document.php';

$db = (new Database())->connect();

$token = Auth::requireAuth();

$data = json_decode(file_get_contents("php://input"), true);
$fileName = Validate::ValidateString($data['fileName']) ?? '';
$fileType = isset($data['fileType']) ? Validate::ValidateString($data['fileType']) : null;
$action = isset($data['action']) ? Validate::ValidateString($data['action']) : 'GetObject';

if ($data) {
    $response = (new Document($db))->presignedUrl($fileName, $fileType, $action);
    $responseCode = $response['success'] ? 200 : 500;
    http_response_code($responseCode);
    echo json_encode($response);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
}
