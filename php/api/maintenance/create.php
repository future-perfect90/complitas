<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Properties.php';

$auth = new Auth();
$token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION']);
if (empty($token)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {

    $token = Auth::requireAuth();

    $db = (new Database())->connect();
    $property = new Properties($db);

    $title = Validate::ValidateString($data['title']);
    $description = Validate::ValidateString($data['description']);
    $typeOfWork = Validate::ValidateString($data['typeOfWork']);
    $propertyId = Validate::ValidateString($data['propertyId']);
    $createdBy = $token->{'https://complitas.dev/user_uuid'};

    $result = $property->addMaintenanceTask($title, $description, $typeOfWork, $propertyId, $createdBy);
    if ($result['success']) {
        http_response_code(201);
        echo json_encode($result);
    } else {
        http_response_code(500);
        echo json_encode($result);
    }
}
