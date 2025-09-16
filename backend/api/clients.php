<?php
include_once '../config/database.php';
include_once '../config/cors.php';
include_once '../models/Client.php';

$database = new Database();
$db = $database->getConnection();

$client = new Client($db);

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['id'])) {
        $client->id = $_GET['id'];
        if ($client->readOne()) {
            http_response_code(200);
            echo json_encode(array(
                "id" => $client->id,
                "first_name" => $client->first_name,
                "last_name" => $client->last_name,
                "email" => $client->email,
                "phone" => $client->phone,
                "address" => $client->address,
                "photo" => $client->photo,
                "id_number" => $client->id_number,
                "wallet_address" => $client->wallet_address,
                "wallet_balance" => $client->wallet_balance,
                "status" => $client->status,
                "created_by" => $client->created_by,
                "created_at" => $client->created_at
            ));
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Client not found."));
        }
    } else {
        $stmt = $client->read();
        $num = $stmt->rowCount();
        
        if ($num > 0) {
            $clients_arr = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                
                $client_item = array(
                    "id" => $id,
                    "first_name" => $first_name,
                    "last_name" => $last_name,
                    "email" => $email,
                    "phone" => $phone,
                    "address" => $address,
                    "photo" => $photo,
                    "id_number" => $id_number,
                    "wallet_address" => $wallet_address,
                    "wallet_balance" => $wallet_balance,
                    "status" => $status,
                    "created_by" => $created_by,
                    "creator_name" => $creator_first_name . ' ' . $creator_last_name,
                    "created_at" => $created_at
                );
                
                array_push($clients_arr, $client_item);
            }
            
            http_response_code(200);
            echo json_encode($clients_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No clients found."));
        }
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->first_name) && !empty($data->last_name) && !empty($data->email) && 
        !empty($data->phone) && !empty($data->address) && !empty($data->id_number) &&
        !empty($data->created_by)) {
        
        $client->first_name = $data->first_name;
        $client->last_name = $data->last_name;
        $client->email = $data->email;
        $client->phone = $data->phone;
        $client->address = $data->address;
        $client->id_number = $data->id_number;
        $client->created_by = $data->created_by;
        
        if ($client->create()) {
            http_response_code(201);
            echo json_encode(array("message" => "Client was created."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create client."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to create client. Data is incomplete."));
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id) && !empty($data->first_name) && !empty($data->last_name) && 
        !empty($data->email) && !empty($data->phone) && !empty($data->address)) {
        
        $client->id = $data->id;
        $client->first_name = $data->first_name;
        $client->last_name = $data->last_name;
        $client->email = $data->email;
        $client->phone = $data->phone;
        $client->address = $data->address;
        $client->status = $data->status;
        
        if ($client->update()) {
            http_response_code(200);
            echo json_encode(array("message" => "Client was updated."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update client."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update client. Data is incomplete."));
    }
}
?>