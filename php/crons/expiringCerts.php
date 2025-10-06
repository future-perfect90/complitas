<?php

require_once __DIR__ . '/../classes/Database.php';
require_once __DIR__ . '/../classes/Communication.php';

$conn = (new Database())->connect();
$communication = new Communication($conn);

$days = $argv[1] ?? '';

if (empty($days)) {
    echo 'Argument 1 must be the amount of days you want to look at in the future.';
    die;
}

$template = file_get_contents(__DIR__ . '/../../templates/emailTemplate.html');

$expiringData = $communication->getExpiringCerts($days);

$groupedProperties = [];
foreach ($expiringData as $expiring) {
    $propertyId = $expiring['propertyId'];

    if (!isset($groupedProperties[$propertyId])) {
        $groupedProperties[$propertyId] = [
            'name'       => $expiring['name'],
            'email'      => $expiring['email'],
            'questions'  => []
        ];
    }

    $groupedProperties[$propertyId]['questions'][] = [
        'question'   => $expiring['question'],
        'area'       => $expiring['area'],
        'validUntil'    => $expiring['validUntil']
    ];

    $groupedProperties[$propertyId]['expiring'][] = "<li>{$expiring['area']} - {$expiring['question']} - {$expiring['validUntil']}</li>";
}

foreach ($groupedProperties as $propertyId => $property) {
    $certs = implode('\n', $groupedProperties[$propertyId]['expiring']);
    echo "sending email to {$property['email']}";
    $body = str_replace('{{user_name}}', $property['name'], $template);
    $body = str_replace('{{certifications}}', $certs, $body);

    $communication->sendEmail([$property['email']], 'Expiring certs', $body);
}
