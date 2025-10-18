<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/User.php';

$auth = new Auth();
$token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION']);
if (empty($token)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {


    $db = (new Database())->connect();
    $user = new User($db);

    $name = Validate::ValidateString($data['payload']['name']);
    $email = Validate::ValidateEmail($data['payload']['email']);
    $companyId = Validate::ValidateString($data['companyId']);
    $password = $data['payload']['password'];
    $createdBy = $token->{'https://complitas.dev/user_uuid'};

    $result = $user->create($name, $email, $password, $companyId, $createdBy);

    if (!$result['success']) {
        if ($result['message'] === 'User already exists') {
            http_response_code(409);
            echo json_encode($result);
        } else {
            http_response_code(500);
            echo json_encode($result);
        }
    } else {
        http_response_code(201);
        echo json_encode([$result]);
    }
}
