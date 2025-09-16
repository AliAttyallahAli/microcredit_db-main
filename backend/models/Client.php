<?php
class Client {
    private $conn;
    private $table_name = "clients";

    public $id;
    public $first_name;
    public $last_name;
    public $email;
    public $phone;
    public $address;
    public $photo;
    public $id_number;
    public $wallet_address;
    public $wallet_balance;
    public $status;
    public $created_by;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET first_name=:first_name, last_name=:last_name, email=:email, 
                  phone=:phone, address=:address, id_number=:id_number, 
                  wallet_address=:wallet_address, created_by=:created_by";
        
        $stmt = $this->conn->prepare($query);
        
        $this->wallet_address = uniqid('client_wallet_');
        
        $stmt->bindParam(":first_name", $this->first_name);
        $stmt->bindParam(":last_name", $this->last_name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":id_number", $this->id_number);
        $stmt->bindParam(":wallet_address", $this->wallet_address);
        $stmt->bindParam(":created_by", $this->created_by);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function read() {
        $query = "SELECT c.*, u.first_name as creator_first_name, u.last_name as creator_last_name 
                  FROM " . $this->table_name . " c 
                  LEFT JOIN users u ON c.created_by = u.id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    public function readOne() {
        $query = "SELECT c.*, u.first_name as creator_first_name, u.last_name as creator_last_name 
                  FROM " . $this->table_name . " c 
                  LEFT JOIN users u ON c.created_by = u.id 
                  WHERE c.id = ? LIMIT 0,1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row) {
            $this->first_name = $row['first_name'];
            $this->last_name = $row['last_name'];
            $this->email = $row['email'];
            $this->phone = $row['phone'];
            $this->address = $row['address'];
            $this->photo = $row['photo'];
            $this->id_number = $row['id_number'];
            $this->wallet_address = $row['wallet_address'];
            $this->wallet_balance = $row['wallet_balance'];
            $this->status = $row['status'];
            $this->created_by = $row['created_by'];
            $this->created_at = $row['created_at'];
            return true;
        }
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET first_name=:first_name, last_name=:last_name, email=:email, 
                  phone=:phone, address=:address, status=:status 
                  WHERE id=:id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":first_name", $this->first_name);
        $stmt->bindParam(":last_name", $this->last_name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":id", $this->id);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>