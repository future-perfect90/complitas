<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../../classes/Document.php';
require_once __DIR__ . '/../../classes/Database.php';

require_once __DIR__ . '/../../classes/Auth.php';

$db = (new Database())->connect();

$token = Auth::requireAuth();

$data = json_decode(file_get_contents("php://input"), true);
if ($data) {
    $response = (new Document($db))->presignedUrl($data['fileName'], $data['fileType'] ?? null, $data['action'] ?? 'GetObject');
    $responseCode = $response['success'] ? 200 : 500;
    http_response_code($responseCode);
    echo json_encode($response);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
}
