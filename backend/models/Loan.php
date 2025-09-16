<?php
class Loan {
    private $conn;
    private $table_name = "loans";

    public $id;
    public $client_id;
    public $amount;
    public $interest_rate;
    public $total_amount;
    public $duration;
    public $status;
    public $created_by;
    public $approved_by;
    public $created_at;

    public $client_name;
    public $creator_name;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT l.*, 
                         c.first_name AS client_first_name, c.last_name AS client_last_name,
                         u.first_name AS creator_first_name, u.last_name AS creator_last_name
                  FROM " . $this->table_name . " l
                  JOIN clients c ON l.client_id = c.id
                  JOIN users u ON l.created_by = u.id
                  ORDER BY l.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readOne() {
        $query = "SELECT l.*, 
                         c.first_name AS client_first_name, c.last_name AS client_last_name,
                         u.first_name AS creator_first_name, u.last_name AS creator_last_name
                  FROM " . $this->table_name . " l
                  JOIN clients c ON l.client_id = c.id
                  JOIN users u ON l.created_by = u.id
                  WHERE l.id = ? LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $this->client_id = $row['client_id'];
            $this->amount = $row['amount'];
            $this->interest_rate = $row['interest_rate'];
            $this->total_amount = $row['total_amount'];
            $this->duration = $row['duration'];
            $this->status = $row['status'];
            $this->created_by = $row['created_by'];
            $this->approved_by = $row['approved_by'];
            $this->created_at = $row['created_at'];
            $this->client_name = $row['client_first_name'] . ' ' . $row['client_last_name'];
            $this->creator_name = $row['creator_first_name'] . ' ' . $row['creator_last_name'];
            return true;
        }
        return false;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  SET client_id=:client_id, amount=:amount, interest_rate=:interest_rate,
                      total_amount=:total_amount, duration=:duration, status='pending', created_by=:created_by";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":client_id", $this->client_id);
        $stmt->bindParam(":amount", $this->amount);
        $stmt->bindParam(":interest_rate", $this->interest_rate);
        $stmt->bindParam(":total_amount", $this->total_amount);
        $stmt->bindParam(":duration", $this->duration);
        $stmt->bindParam(":created_by", $this->created_by);

        return $stmt->execute();
    }

    public function updateStatus() {
        $query = "UPDATE " . $this->table_name . "
                  SET status=:status, approved_by=:approved_by
                  WHERE id=:id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":approved_by", $this->approved_by);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }
}
?>
