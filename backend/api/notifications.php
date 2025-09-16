<?php
include_once '../config/database.php';
include_once '../config/cors.php';
include_once '../models/Notification.php';

$database = new Database();
$db = $database->getConnection();

$notification = new Notification($db);

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['user_id'])) {
        $notification->user_id = $_GET['user_id'];
        $stmt = $notification->readByUser();
        $num = $stmt->rowCount();
        
        if ($num > 0) {
            $notifications_arr = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                
                $notification_item = array(
                    "id" => $id,
                    "user_id" => $user_id,
                    "message" => $message,
                    "type" => $type,
                    "is_read" => $is_read,
                    "created_at" => $created_at
                );
                
                array_push($notifications_arr, $notification_item);
            }
            
            http_response_code(200);
            echo json_encode($notifications_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No notifications found."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "User ID is required."));
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->user_id) && !empty($data->message) && !empty($data->type)) {
        $notification->user_id = $data->user_id;
        $notification->message = $data->message;
        $notification->type = $data->type;
        
        if ($notification->create()) {
            http_response_code(201);
            echo json_encode(array("message" => "Notification was created."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create notification."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to create notification. Data is incomplete."));
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        $notification->id = $data->id;
        
        if ($notification->markAsRead()) {
            http_response_code(200);
            echo json_encode(array("message" => "Notification marked as read."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to mark notification as read."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to mark notification as read. ID is missing."));
    }
}
?>