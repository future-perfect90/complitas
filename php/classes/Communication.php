<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '../../classes/Config.php';

use Aws\Ses\SesClient;
use Aws\Sns\SnsClient;
use Aws\Exception\AwsException;

class Communication
{

    private $sesClient;
    private $snsClient;

    public function __construct()
    {
        $this->sesClient = $this->getEmailClient();
        $this->snsClient = $this->getMessageClient();
    }

    private function getEmailClient()
    {
        return $this->sesClient ?? new SesClient([
            'version' => 'latest',
            'region'  => (new Conf())->awsConfig()['region']
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

}
