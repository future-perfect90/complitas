<?php 
require_once(__DIR__ . '/../classes/Database.php');
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$conn = (new Database())->connect();

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        // Check for a specific action in the query parameters.
        if (isset($_GET['action']) && $_GET['action'] === 'getItems') {
            
            $stmt = $conn->prepare("SELECT * FROM test_table");
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($results);
            http_response_code(200);
        } else {
            // If no valid action is provided, send a "Not Found" error.
            http_response_code(404);
            echo json_encode(['message' => 'Action not found.']);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if ($data && isset($data['company_name']) && isset($data['vat_no']) && isset($data['company_reg_no'])) {

            $stmt = $conn->prepare("INSERT INTO test_table (company_name, vat_no, company_reg_no) VALUES (:company_name, :vat_no, :company_reg_no)");
            $stmt->bindParam(':company_name', $data['company_name']);
            $stmt->bindParam(':vat_no', $data['vat_no']);
            $stmt->bindParam(':company_reg_no', $data['company_reg_no']);
            $stmt->execute();
            $inserted = $stmt->rowCount();
            echo json_encode(['inserted' => $inserted]);

        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid data provided.']);
        }
        break;

    default:
        // Handle any other request methods (e.g., PUT, DELETE) with an error.
        http_response_code(405); // Method Not Allowed
        echo json_encode(['message' => 'Method not allowed.']);
        break;
}

?>