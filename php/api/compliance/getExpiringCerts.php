<?php
require_once __DIR__ . '/../../shared/classes.php';
require_once __DIR__ . '/../../classes/Compliance.php';

$auth = new Auth();
$token = $auth->requireAuth();

$companyId = $token->{'https://complitas.dev/company_uuid'};
$page = Validate::ValidateInt($_GET['page']) ?? 1;
$itemsPerPage = Validate::ValidateInt($_GET['limit']) ?? 10;
$offset = ($page - 1) * $itemsPerPage;

if (!$companyId) {
    http_response_code(400);
    echo json_encode(['message' => 'Company ID is required.']);
    exit;
}

$db = new Database();
$compliance = new Compliance($db->connect());
echo json_encode($compliance->getExpiringCerts($companyId, $itemsPerPage, $offset));
