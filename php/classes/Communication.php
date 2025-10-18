<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '../../classes/Config.php';
require_once __DIR__ . '../../classes/Database.php';

use Aws\Ses\SesClient;
use Aws\Sns\SnsClient;
use Aws\Exception\AwsException;

class Communication
{

    private $sesClient;
    private $snsClient;

    private $pdo;

    public function __construct(?PDO $pdo = null)
    {
        $this->sesClient = $this->getEmailClient();
        $this->snsClient = $this->getMessageClient();
        $this->pdo = $pdo ?? (new Database())->connect();
    }

    private function getEmailClient()
    {
        var_dump(Conf::awsConfig());
        return $this->sesClient ?? new SesClient([
            'key' => Conf::awsConfig()['key'],
            'secret' => Conf::awsConfig()['secret'],
            'version' => 'latest',
            'region'  => Conf::awsConfig()['region']
        ]);
    }

    private function getMessageClient()
    {

        return $this->snsClient ?? new SnsClient([
            'version' => 'latest',
            'region'  => (new Conf())->awsConfig()['region']
        ]);
    }

    public function sendEmail(array $to, string $subject, string $body)
    {

        try {
            $sender_email = 'sender@complitas.co.uk';
            $recipient_emails = $to;
            $char_set = 'UTF-8';

            $result = $this->sesClient->sendEmail([
                'Destination' => [
                    'ToAddresses' => $recipient_emails,
                ],
                'ReplyToAddresses' => [$sender_email],
                'Source' => $sender_email,
                'Message' => [
                    'Body' => [
                        'Html' => [
                            'Charset' => $char_set,
                            'Data' => $body,
                        ],
                        'Text' => [
                            'Charset' => $char_set,
                            'Data' => $body,
                        ],
                    ],
                    'Subject' => [
                        'Charset' => $char_set,
                        'Data' => $subject,
                    ],
                ],

            ]);
            return "Email sent successfully! Email ID: {$result['MessageId']}\n";

        } catch (AwsException $e) {
            echo $e->getMessage();
            error_log("The email was not sent. Error: " . $e->getAwsErrorMessage() . "\n");
            return "The email was not sent. Error: " . $e->getAwsErrorMessage() . "\n";
        }
    }

    public function sendMessage(string $to, string $body): string
    {
        try {
            $result = $this->snsClient->publish([
                'Message' => $body,
                'PhoneNumber' => $to,
                'MessageAttributes' => [
                    'AWS.SNS.SMS.SenderID' => [
                        'DataType' => 'String',
                        'StringValue' => 'Complitas'
                    ],
                    'AWS.SNS.SMS.SMSType' => [
                        'DataType' => 'String',
                        'StringValue' => 'Transactional'
                    ]
                ]
            ]);
            $messageId = $result['MessageId'];
            return "SMS sent successfully! Message ID: $messageId\n";
        } catch (AwsException $e) {
            // output error message if fails
            error_log($e->getMessage());
            return "The SMS was not sent. Error: " . $e->getAwsErrorMessage() . "\n";
        }
    }

    public function getExpiringCerts(string $days): array
    {

        $sql = "SELECT p.id as propertyId, p.name, CONCAT(p.address1, ', ', p.address2, ', ', p.city, ', ', p.county, ', ', p.postCode) as propertyAddress, p.managerName, qr.id as questionResponseId, p.managerEmail, qr.validUntil, cq.question, cq.area
        FROM properties p join reports r on r.propertyId=p.id 
        JOIN question_responses qr on qr.reportId = r.id 
        JOIN compliance_questions cq on qr.questionId=cq.id 
        WHERE qr.answer = 1 and qr.validUntil = DATE(date_add(now(), interval $days day))
        ORDER BY p.id, cq.area";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
