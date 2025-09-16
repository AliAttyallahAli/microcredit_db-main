<?php
include_once '../config/database.php';
include_once '../config/cors.php';
include_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!empty($data->username) && !empty($data->password)) {
        $user->username = $data->username;
        $user->password = $data->password;
        
        if ($user->login()) {
            http_response_code(200);
            echo json_encode(array(
                "message" => "Login successful.",
                "user" => array(
                    "id" => $user->id,
                    "username" => $user->username,
                    "role" => $user->role,
                    "first_name" => $user->first_name,
                    "last_name" => $user->last_name,
                    "wallet_address" => $user->wallet_address,
                    "wallet_balance" => $user->wallet_balance
                )
            ));
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Login failed."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to login. Data is incomplete."));
    }
}
?>