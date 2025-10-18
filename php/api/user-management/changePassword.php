<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/User.php';

$token = Auth::requireAuth();
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $auth = new Auth();

    $userId = Validate::ValidateString($data['userId']) ?? null;
    $password = $data['password'];

    $result = $auth->changePassword($userId, $password);

    if (!$result['success']) {
        http_response_code(500);
        echo json_encode($result);
    } else {
        http_response_code(200);
        echo json_encode([$result]);
    }
}
