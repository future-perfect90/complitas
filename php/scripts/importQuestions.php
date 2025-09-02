<?php
require_once(__DIR__ . '/../../vendor/autoload.php');
require_once __DIR__ . '/../classes/Database.php';

$db = (new Database())->connect();
$complianceQuestionsFile = __DIR__ . '/compliance_questions.csv';

$data = file_get_contents($complianceQuestionsFile);

//read through each line of the csv to get the data
$lines = explode(PHP_EOL, $data);
$complianceQuestions = [];
foreach ($lines as $line) {
    $complianceQuestions[] = str_getcsv($line, ",", '"', "\\");
}
$count = 0;
foreach ($complianceQuestions as $question) {
    $stmt = $db->prepare("INSERT INTO compliance_questions (area, question, answerType, uploadRequired) VALUES (?, ?, ?, ?)");
    $stmt->execute([$question[0], $question[1], $question[2], (bool)$question[3]]);
    $count++;
}
echo "$count questions imported successfully.";
