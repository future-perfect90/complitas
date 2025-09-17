<?php
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../../classes/Communication.php';
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Auth.php';

$auth = new Auth();
$token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION']);
if (empty($token)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if ($data && isset($data['to'], $data['subject'], $data['body'])) {
    $communication = new Communication();
    $messageSent = $communication->sendMessage($data['to'], $data['body']);

    http_response_code(200);
    echo json_encode(['success' => true, 'message' => $messageSent]);
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input. Please provide to, subject, and body.']);
}
