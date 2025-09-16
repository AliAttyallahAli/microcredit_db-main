<?php
include_once '../config/database.php';
include_once '../config/cors.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['address'])) {
        $wallet_address = $_GET['address'];
        
        // Vérifier si l'adresse appartient à un utilisateur
        $query = "SELECT id, username, email, role, first_name, last_name, photo, 
                  wallet_address, wallet_balance, status, created_at 
                  FROM users WHERE wallet_address = :address";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':address', $wallet_address);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            http_response_code(200);
            echo json_encode(array(
                "type" => "user",
                "data" => $row
            ));
            exit();
        }
        
        // Vérifier si l'adresse appartient à un client
        $query = "SELECT id, first_name, last_name, email, phone, address, photo, 
                  id_number, wallet_address, wallet_balance, status, created_by, created_at 
                  FROM clients WHERE wallet_address = :address";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':address', $wallet_address);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            http_response_code(200);
            echo json_encode(array(
                "type" => "client",
                "data" => $row
            ));
            exit();
        }
        
        // Si aucune correspondance trouvée
        http_response_code(404);
        echo json_encode(array("message" => "Wallet not found."));
        
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Wallet address is required."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>