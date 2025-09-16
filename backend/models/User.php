<?php
class User {
    private $conn;
    private $table_name = "users";
    public $id;
    public $username;
    public $password;
    public $email;
    public $role;
    public $first_name;
    public $last_name;
    public $photo;
    public $wallet_address;
    public $wallet_balance;
    public $status;
    public $created_at;
    public $updated_at;
    public function __construct($db) {
        $this->conn = $db;
    }

    public function login() {
        $query = "SELECT id, username, password, role, first_name, last_name, wallet_address, wallet_balance 
                  FROM " . $this->table_name . " 
                  WHERE username = ? AND status = 'active'";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->username);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (password_verify($this->password, $row['password'])) {
                $this->id = $row['id'];
                $this->role = $row['role'];
                $this->first_name = $row['first_name'];
                $this->last_name = $row['last_name'];
                $this->wallet_address = $row['wallet_address'];
                $this->wallet_balance = $row['wallet_balance'];
                return true;
            }
        }
        return false;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET username=:username, password=:password, email=:email, role=:role, 
                  first_name=:first_name, last_name=:last_name, wallet_address=:wallet_address";
        
        $stmt = $this->conn->prepare($query);
        
        $this->password = password_hash($this->password, PASSWORD_DEFAULT);
        $this->wallet_address = uniqid('wallet_');
        
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":role", $this->role);
        $stmt->bindParam(":first_name", $this->first_name);
        $stmt->bindParam(":last_name", $this->last_name);
        $stmt->bindParam(":wallet_address", $this->wallet_address);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function read() {
        $query = "SELECT id, username, email, role, first_name, last_name, photo, 
                  wallet_address, wallet_balance, status, created_at 
                  FROM " . $this->table_name;
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET email=:email, first_name=:first_name, last_name=:last_name, 
                  status=:status WHERE id=:id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":first_name", $this->first_name);
        $stmt->bindParam(":last_name", $this->last_name);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":id", $this->id);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>