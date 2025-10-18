<?php

require_once __DIR__ . '/../classes/Database.php';
require_once __DIR__ . '/../classes/Communication.php';

$conn = (new Database())->connect();
$communication = new Communication($conn);

$days = $argv[1] ?? '';

if (empty($days)) {
    echo 'Argument 1 must be the amount of days you want to look at in the future.\n';
    die;
}

$template = file_get_contents(__DIR__ . '/../../templates/emailTemplate.html');

$expiringData = $communication->getExpiringCerts($days);

$groupedProperties = [];
foreach ($expiringData as $expiring) {
    $propertyId = $expiring['propertyId'];

    if (!isset($groupedProperties[$propertyId])) {
        $groupedProperties[$propertyId] = [
            'managerName'       => $expiring['managerName'],
            'managerEmail'      => $expiring['managerEmail'],
            'questions'  => [],
            'propertyAddress'   => $expiring['propertyAddress'],
            'propertyName' => $expiring['name']
        ];
    }

    $groupedProperties[$propertyId]['questions'][] = [
        'question'   => $expiring['question'],
        'area'       => $expiring['area'],
        'validUntil'    => date('d-m-Y', strtotime($expiring['validUntil']))
    ];
    $formattedDate = date('d-m-Y', strtotime($expiring['validUntil']));

    $groupedProperties[$propertyId]['expiring'][] = "<table role='presentation' style='margin-bottom: 10px; border-top: 1px solid #e0e0e0; width:100%;'>
                                <tr>
                                    <td style='font-size: 14px; color: #4D83AF;'>
                                        <span class='cert-area' style='font-weight: bold; color: #4D83AF;'>&bull; {$expiring['area']}:</span> <span style='color: #000;'>{$expiring['question']}</span>
                                    </td>
                                    <td style='font-size: 14px; color: #333333; white-space: nowrap; float:right;'>
                                        <span class='expiration-label' style='font-weight: normal; margin-right: 5px; color: #555555;'>Expires:</span> <span class='expiration-date' style='font-weight: bold; color: #dc3545;'>
                                                $formattedDate
                                            </span>
                                    </td>
                                </tr>
                            </table>";


}
$count = 0;
foreach ($groupedProperties as $propertyId => $property) {
    $certs = implode('', $property['expiring']);
    echo "sending email to {$property['managerEmail']}\n";
    $body = str_replace('{{userName}}', $property['managerName'], $template);
    $body = str_replace('{{certifications}}', $certs, $body);
    $body = str_replace('{{days}}', $days, $body);
    $body = str_replace('{{propertyName}}', $property['propertyName'], $body);
    $body = str_replace('{{propertyAddress}}', $property['propertyAddress'], $body);
    $body = str_replace('{{propertyId}}', $propertyId, $body);


    $communication->sendEmail([$property['managerEmail']], "Certification Expiration for {$property['propertyName']} expires in $days days", $body);
    $count++;
}
echo "Email sent to {$count} properties.";
