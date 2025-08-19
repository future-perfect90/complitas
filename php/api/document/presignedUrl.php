<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../../classes/Document.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $response = (new Document())->presignedUrl($data['fileName'], $data['fileType']);
    $responseCode = $response['success'] ? 200 : 500;
    http_response_code($responseCode);
}
echo json_encode($response);
