<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Document.php';
require_once __DIR__ . '/../../classes/Auth.php';
require_once __DIR__ . '/../../../vendor/autoload.php';

// $token = Auth::requireAuth();

$reportId = $_GET['reportId'] ?? null;
$propertyId = $_GET['propertyId'] ?? null;

$pdo = (new Database())->connect();

$sql = "SELECT al.timestamp, al.action_type, al.old_value, al.new_value, u.name, r.propertyId, cq.question, cq.area FROM `audit_log` al
JOIN question_responses qr on al.record_id=qr.id
JOIN reports r ON r.id=qr.reportId
JOIN compliance_questions cq ON cq.id=qr.questionId
JOIN user u ON u.id=al.performing_user_id
ORDER BY al.timestamp ASC;";
