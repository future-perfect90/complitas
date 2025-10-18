<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Company.php';

$auth = new Auth();
$token = Auth::requireAuth();
if (!$auth->hasRole('SuperAdmin', $token)) {
    http_response_code(403);
    echo json_encode(['message' => 'Forbidden: You do not have access to this resource.']);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
if ($data) {

    $db = (new Database())->connect();
    $company = new Company($db);
    $companyId = Validate::ValidateString($data['id']);

    $result = $company->update($companyId, $data['payload']);

    if ($result['success']) {
        http_response_code(204);
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode([$result]);
    }
}
