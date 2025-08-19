<?php
require_once __DIR__ . '/../../shared/headers.php';
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../../classes/Document.php';

(new Document())->generatePDF();
