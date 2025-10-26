<?php
require_once __DIR__ . '/../classes/Config.php';
require_once __DIR__ . '/../classes/Database.php';

use Ramsey\Uuid\Uuid;
use Aws\S3\S3Client;

class Document
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    private function createS3Client()
    {
        return new S3Client([
            'region' => 'eu-west-2',
            'version' => 'latest',
            'credentials' => [
                'key'    => $_ENV['AWS_ACCESS_KEY_ID'],
                'secret' => $_ENV['AWS_SECRET_ACCESS_KEY'],
            ]
        ]);
    }

    public function presignedUrl(string $filePath, string|null $fileType, string $action = 'GetObject'): array
    {
        $s3 = $this->createS3Client();

        $bucket = $_ENV["AWS_S3_BUCKET"];

        $cmd = $s3->getCommand($action, [
            'Bucket' => $bucket,
            'Key'    => $filePath,
            $fileType ?? 'ContentType' => $fileType
        ]);

        $request = $s3->createPresignedRequest($cmd, '+15 minutes');
        $presignedUrl = (string) $request->getUri();

        return ['success' => true, 'message' => 'Presigned URL created', 'presignedUrl' => $presignedUrl];
    }

    public function getReportData(string $reportId): array
    {
        $sql = "SELECT 
            (SELECT p.name FROM reports r JOIN properties p ON p.id = r.propertyId WHERE r.id = :reportId) AS propertyName, 
            ca.area, 
            cq.question, 
            cq.dateType,
            qr.answer, 
            qr.fileName, 
            qr.savedDate,
            ca.displayOrder
        FROM compliance_questions cq 
        LEFT JOIN question_responses qr ON cq.id = qr.questionId AND qr.reportId = :reportId1
        LEFT JOIN compliance_area ca ON cq.area = ca.id
        ORDER BY ca.displayOrder, cq.question";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':reportId', $reportId);
        $stmt->bindParam(':reportId1', $reportId);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($results as &$row) {
            if (!empty($row['fileName'])) {
                $presignedUrlData = $this->presignedUrl("compliance/$reportId/" . $row['fileName'], null, 'GetObject');
                $row['fileUrl'] = $presignedUrlData['success'] ? $presignedUrlData['presignedUrl'] : null;
            }
        }
        return $results;
    }

    public function getMaintenanceTasksReportData(string $propertyId): array
    {
        $sql = "SELECT mt.id, mt.title, mt.description, mt.typeOfWork, mt.evidence as fileName, mt.completedAt, mt.propertyId, mt.createdAt, mc.name, mc.contactName, mc.contactAddress, mc.contactNumber 
        FROM maintenance_tasks mt 
        LEFT JOIN maintenance_companies mc ON mt.completedBy = mc.id 
        WHERE propertyId = :property_id
        ORDER BY createdAt DESC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':property_id', $propertyId);
        $stmt->execute();

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($results as &$row) {
            if (!empty($row['fileName'])) {
                $presignedUrlData = $this->presignedUrl("maintenance/" . $row['fileName'], null, 'GetObject');
                $row['fileUrl'] = $presignedUrlData['success'] ? $presignedUrlData['presignedUrl'] : null;
            }
        }
        return $results;
    }
}
