<?php
include_once '../config/database.php';
include_once '../config/cors.php';
include_once '../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Récupérer un utilisateur spécifique ou tous les utilisateurs
    if (isset($_GET['id'])) {
        $user->id = $_GET['id'];
        if ($user->readOne()) {
            http_response_code(200);
            echo json_encode(array(
                "id" => $user->id,
                "username" => $user->username,
                "email" => $user->email,
                "role" => $user->role,
                "first_name" => $user->first_name,
                "last_name" => $user->last_name,
                "photo" => $user->photo,
                "wallet_address" => $user->wallet_address,
                "wallet_balance" => $user->wallet_balance,
                "status" => $user->status,
                "created_at" => $user->created_at
            ));
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "User not found."));
        }
    } else {
        $stmt = $user->read();
        $num = $stmt->rowCount();
        
        if ($num > 0) {
            $users_arr = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                
                $user_item = array(
                    "id" => $id,
                    "username" => $username,
                    "email" => $email,
                    "role" => $role,
                    "first_name" => $first_name,
                    "last_name" => $last_name,
                    "photo" => $photo,
                    "wallet_address" => $wallet_address,
                    "wallet_balance" => $wallet_balance,
                    "status" => $status,
                    "created_at" => $created_at
                );
                
                array_push($users_arr, $user_item);
            }
            
            http_response_code(200);
            echo json_encode($users_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No users found."));
        }
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->username) && !empty($data->password) && !empty($data->email) && 
        !empty($data->role) && !empty($data->first_name) && !empty($data->last_name)) {
        
        $user->username = $data->username;
        $user->password = $data->password;
        $user->email = $data->email;
        $user->role = $data->role;
        $user->first_name = $data->first_name;
        $user->last_name = $data->last_name;
        
        if ($user->create()) {
            http_response_code(201);
            echo json_encode(array("message" => "User was created."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create user."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to create user. Data is incomplete."));
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id) && !empty($data->email) && !empty($data->first_name) && 
        !empty($data->last_name) && !empty($data->status)) {
        
        $user->id = $data->id;
        $user->email = $data->email;
        $user->first_name = $data->first_name;
        $user->last_name = $data->last_name;
        $user->status = $data->status;
        
        if ($user->update()) {
            http_response_code(200);
            echo json_encode(array("message" => "User was updated."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update user."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update user. Data is incomplete."));
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        $user->id = $data->id;
        
        if ($user->delete()) {
            http_response_code(200);
            echo json_encode(array("message" => "User was deleted."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to delete user."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to delete user. ID is missing."));
    }
}
?>