<?php
include_once '../config/database.php';
include_once '../config/cors.php';
include_once '../models/Repayment.php';

$database = new Database();
$db = $database->getConnection();

$repayment = new Repayment($db);

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['loan_id'])) {
        $repayment->loan_id = $_GET['loan_id'];
        $stmt = $repayment->readByLoan();
        $num = $stmt->rowCount();
        
        if ($num > 0) {
            $repayments_arr = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                
                $repayment_item = array(
                    "id" => $id,
                    "loan_id" => $loan_id,
                    "amount" => $amount,
                    "interest_amount" => $interest_amount,
                    "remaining_balance" => $remaining_balance,
                    "transaction_id" => $transaction_id,
                    "transaction_ref" => $transaction_ref,
                    "payment_date" => $payment_date
                );
                
                array_push($repayments_arr, $repayment_item);
            }
            
            http_response_code(200);
            echo json_encode($repayments_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No repayments found for this loan."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Loan ID is required."));
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->loan_id) && !empty($data->amount) && !empty($data->user_id)) {
        
        if ($repayment->processRepayment($data->loan_id, $data->amount, $data->user_id)) {
            http_response_code(201);
            echo json_encode(array("message" => "Repayment processed successfully."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to process repayment."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to process repayment. Data is incomplete."));
    }
}
?>