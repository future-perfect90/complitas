<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../../classes/Document.php';

require_once __DIR__ . '/../../classes/Auth.php';

$auth = new Auth();
$token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION']);
if (empty($token)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
if ($data) {
    $response = (new Document())->presignedUrl($data['fileName'], $data['fileType'] ?? null, $data['action'] ?? 'GetObject');
    $responseCode = $response['success'] ? 200 : 500;
    http_response_code($responseCode);
    echo json_encode($response);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
}
