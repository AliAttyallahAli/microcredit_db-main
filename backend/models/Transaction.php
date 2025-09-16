<?php
class Transaction {
    private $conn;
    private $table_name = "transactions";

    public $id;
    public $transaction_ref;
    public $sender_wallet;
    public $receiver_wallet;
    public $amount;
    public $transaction_type;
    public $description;
    public $status;
    public $validated_by;
    public $created_by;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET transaction_ref=:transaction_ref, sender_wallet=:sender_wallet, 
                  receiver_wallet=:receiver_wallet, amount=:amount, 
                  transaction_type=:transaction_type, description=:description, 
                  created_by=:created_by";
        
        $stmt = $this->conn->prepare($query);
        
        $this->transaction_ref = uniqid('trans_');
        
        $stmt->bindParam(":transaction_ref", $this->transaction_ref);
        $stmt->bindParam(":sender_wallet", $this->sender_wallet);
        $stmt->bindParam(":receiver_wallet", $this->receiver_wallet);
        $stmt->bindParam(":amount", $this->amount);
        $stmt->bindParam(":transaction_type", $this->transaction_type);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":created_by", $this->created_by);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function read() {
        $query = "SELECT t.*, u1.first_name as creator_first_name, u1.last_name as creator_last_name, 
                  u2.first_name as validator_first_name, u2.last_name as validator_last_name 
                  FROM " . $this->table_name . " t 
                  LEFT JOIN users u1 ON t.created_by = u1.id 
                  LEFT JOIN users u2 ON t.validated_by = u2.id 
                  ORDER BY t.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    public function updateStatus() {
        $query = "UPDATE " . $this->table_name . " 
                  SET status=:status, validated_by=:validated_by 
                  WHERE id=:id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":validated_by", $this->validated_by);
        $stmt->bindParam(":id", $this->id);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function executeTransaction() {
        try {
            $this->conn->beginTransaction();

            // Débiter le portefeuille expéditeur
            $query = "UPDATE users SET wallet_balance = wallet_balance - :amount 
                      WHERE wallet_address = :sender_wallet";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":amount", $this->amount);
            $stmt->bindParam(":sender_wallet", $this->sender_wallet);
            $stmt->execute();

            // Créditer le portefeuille destinataire
            $query = "UPDATE users SET wallet_balance = wallet_balance + :amount 
                      WHERE wallet_address = :receiver_wallet";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":amount", $this->amount);
            $stmt->bindParam(":receiver_wallet", $this->receiver_wallet);
            $stmt->execute();

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }
}
?>