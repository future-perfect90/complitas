<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/User.php';

$token = Auth::requireAuth();
$conn = (new Database())->connect();
$user = new User($conn);

$data = json_decode(file_get_contents('php://input'), true);
$userId = Validate::ValidateString($data['userId']);
$propertyIds = array_map('Validate::ValidateString', $data['propertyIds']);

$result = $user->assignUserToProperty($userId, $propertyIds);

if ($result['success']) {
    http_response_code(200);
    echo json_encode($result);
} else {
    http_response_code(400);
    echo json_encode($result);
}
