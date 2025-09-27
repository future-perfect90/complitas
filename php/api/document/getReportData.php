<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../classes/Document.php';
require_once __DIR__ . '/../../classes/Auth.php';
require_once __DIR__ . '/../../../vendor/autoload.php';

$auth = new Auth();
$token = $auth->validateToken($_SERVER['HTTP_AUTHORIZATION'] ?? '');
if (empty($token)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

$reportId = $_GET['reportId'] ?? null;

if (!$reportId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input. Please provide a reportId.']);
    exit();
}

$document = new Document();
$pdo = (new Database())->connect();

$sql = "SELECT 
            (SELECT p.name FROM reports r JOIN properties p ON p.id = r.propertyId WHERE r.id = :reportId) AS propertyName, 
            cq.area, 
            cq.question, 
            qr.answer, 
            qr.fileName, 
            qr.validUntil 
        FROM compliance_questions cq 
        LEFT JOIN question_responses qr ON cq.id = qr.questionId AND qr.reportId = :reportId1
        ORDER BY cq.area, cq.question";

$stmt = $pdo->prepare($sql);
$stmt->bindParam(':reportId', $reportId);
$stmt->bindParam(':reportId1', $reportId);
$stmt->execute();
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($results as &$row) {
    if (!empty($row['fileName'])) {
        $presignedUrlData = $document->presignedUrl("compliance/$reportId/" . $row['fileName'], null, 'GetObject');
        $row['fileUrl'] = $presignedUrlData['success'] ? $presignedUrlData['presignedUrl'] : null;
    }
}
echo json_encode($results);
