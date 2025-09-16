<?php
include_once '../config/database.php';
include_once '../config/cors.php';
include_once '../models/Loan.php';
include_once '../models/Client.php';
include_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();

$loan = new Loan($db);

header("Content-Type: application/json; charset=UTF-8");

$request_method = $_SERVER['REQUEST_METHOD'];

if ($request_method == 'GET') {
    if (isset($_GET['id'])) {
        $loan->id = $_GET['id'];
        if ($loan->readOne()) {
            echo json_encode([
                "id" => $loan->id,
                "client_id" => $loan->client_id,
                "client_name" => $loan->client_name,
                "amount" => $loan->amount,
                "interest_rate" => $loan->interest_rate,
                "total_amount" => $loan->total_amount,
                "duration" => $loan->duration,
                "status" => $loan->status,
                "creator_name" => $loan->creator_name,
                "created_at" => $loan->created_at
            ]);
        } else {
            http_response_code(404);
            echo json_encode([]);
        }
    } else {
        $stmt = $loan->read();
        $num = $stmt->rowCount();
        $loans_arr = [];
        if ($num > 0) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $loan_item = [
                    "id" => $row['id'],
                    "client_id" => $row['client_id'],
                    "client_name" => $row['client_first_name'] . ' ' . $row['client_last_name'],
                    "amount" => $row['amount'],
                    "interest_rate" => $row['interest_rate'],
                    "total_amount" => $row['total_amount'],
                    "duration" => $row['duration'],
                    "status" => $row['status'],
                    "creator_name" => $row['creator_first_name'] . ' ' . $row['creator_last_name'],
                    "created_at" => $row['created_at']
                ];
                array_push($loans_arr, $loan_item);
            }
        }
        echo json_encode($loans_arr);
    }
}

elseif ($request_method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    if (!empty($data->client_id) && !empty($data->amount) && !empty($data->interest_rate) && !empty($data->duration) && !empty($data->created_by)) {
        $loan->client_id = $data->client_id;
        $loan->amount = $data->amount;
        $loan->interest_rate = $data->interest_rate;
        $loan->total_amount = $data->total_amount;
        $loan->duration = $data->duration;
        $loan->created_by = $data->created_by;

        if ($loan->create()) {
            http_response_code(201);
            echo json_encode(["message" => "Loan was created."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to create loan."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
}

elseif ($request_method == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    if (!empty($data->id) && !empty($data->status)) {
        $loan->id = $data->id;
        $loan->status = $data->status;
        $loan->approved_by = $data->approved_by ?? null;

        if ($loan->updateStatus()) {
            echo json_encode(["message" => "Loan status updated."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to update loan status."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data for update."]);
    }
}
?>
