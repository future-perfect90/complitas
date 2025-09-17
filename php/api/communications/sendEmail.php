<?php

require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../../classes/Communication.php';
require_once __DIR__ . '/../../classes/Auth.php';

//GET THE CONTENTS OF THE TEMPLATE
$template = file_get_contents(__DIR__ . '/../../../templates/emailTemplate.html');

$data = json_decode(file_get_contents("php://input"), true);

if ($data && isset($data['to'], $data['subject'], $data['body'])) {
    //REPLACE THE CONTENT OF THE EMAIL WITH THE VARIABLES
    $body = str_replace('{{user_name}}', $data['to'], $template);
    $body = str_replace('{{certifications}}', $data['body'], $body);

    $communication = new Communication();
    $emailSent = $communication->sendEmail($data['to'], $data['subject'], $body);

    http_response_code(200);
    echo json_encode(['success' => true, 'message' => $emailSent]);
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input. Please provide to, subject, and body.']);
}
