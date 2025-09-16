<?php
include_once '../config/database.php';
include_once '../config/cors.php';
include_once '../models/Transaction.php';

$database = new Database();
$db = $database->getConnection();

$transaction = new Transaction($db);

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = $transaction->read();
    $num = $stmt->rowCount();
    
    if ($num > 0) {
        $transactions_arr = array();
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            
            $transaction_item = array(
                "id" => $id,
                "transaction_ref" => $transaction_ref,
                "sender_wallet" => $sender_wallet,
                "receiver_wallet" => $receiver_wallet,
                "amount" => $amount,
                "transaction_type" => $transaction_type,
                "description" => $description,
                "status" => $status,
                "validated_by" => $validated_by,
                "validator_name" => $validator_first_name . ' ' . $validator_last_name,
                "created_by" => $created_by,
                "creator_name" => $creator_first_name . ' ' . $creator_last_name,
                "created_at" => $created_at
            );
            
            array_push($transactions_arr, $transaction_item);
        }
        
        http_response_code(200);
        echo json_encode($transactions_arr);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "No transactions found."));
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->sender_wallet) && !empty($data->receiver_wallet) && 
        !empty($data->amount) && !empty($data->transaction_type) && 
        !empty($data->created_by)) {
        
        $transaction->sender_wallet = $data->sender_wallet;
        $transaction->receiver_wallet = $data->receiver_wallet;
        $transaction->amount = $data->amount;
        $transaction->transaction_type = $data->transaction_type;
        $transaction->description = $data->description;
        $transaction->created_by = $data->created_by;
        
        if ($transaction->create()) {
            http_response_code(201);
            echo json_encode(array(
                "message" => "Transaction was created.",
                "transaction_ref" => $transaction->transaction_ref
            ));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create transaction."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to create transaction. Data is incomplete."));
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id) && !empty($data->status) && !empty($data->validated_by)) {
        
        $transaction->id = $data->id;
        $transaction->status = $data->status;
        $transaction->validated_by = $data->validated_by;
        
        if ($transaction->updateStatus()) {
            // Si la transaction est approuvée, l'exécuter
            if ($data->status == 'approved') {
                if ($transaction->executeTransaction()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Transaction was approved and executed."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Transaction approved but execution failed."));
                }
            } else {
                http_response_code(200);
                echo json_encode(array("message" => "Transaction status was updated."));
            }
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update transaction status."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update transaction. Data is incomplete."));
    }
}
?>