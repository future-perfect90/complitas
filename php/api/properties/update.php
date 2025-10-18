<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Properties.php';
$token = Auth::requireAuth();
$updatedBy = $token->{'https://complitas.dev/user_uuid'};
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $db = (new Database())->connect();
    $property = new Properties($db);

    $propertyId = Validate::ValidateString($data['id']);

    unset($data['data']['id']);
    $dataToUpdate = $data['data'];
    $result = $property->update($propertyId, $dataToUpdate, $updatedBy);

    if ($result['success']) {
        http_response_code(204);
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode([$result]);
    }
}
