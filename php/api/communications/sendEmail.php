<?php

require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../../classes/Communication.php';

$communication = new Communication();
$emailSent = $communication->sendEmail(['luke@complitas.co.uk'], 'test subject', 'test body123');

http_response_code(200);
echo json_encode(['success' => true, 'message' => $emailSent]);
