<?php
class Repayment {
    private $conn;
    private $table_name = "repayments";

    public $id;
    public $loan_id;
    public $amount;
    public $interest_amount;
    public $remaining_balance;
    public $transaction_id;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET loan_id=:loan_id, amount=:amount, interest_amount=:interest_amount, 
                  remaining_balance=:remaining_balance, transaction_id=:transaction_id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":loan_id", $this->loan_id);
        $stmt->bindParam(":amount", $this->amount);
        $stmt->bindParam(":interest_amount", $this->interest_amount);
        $stmt->bindParam(":remaining_balance", $this->remaining_balance);
        $stmt->bindParam(":transaction_id", $this->transaction_id);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function readByLoan() {
        $query = "SELECT r.*, t.transaction_ref, t.created_at as payment_date
                  FROM " . $this->table_name . " r 
                  LEFT JOIN transactions t ON r.transaction_id = t.id 
                  WHERE r.loan_id = :loan_id 
                  ORDER BY r.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":loan_id", $this->loan_id);
        $stmt->execute();
        
        return $stmt;
    }

    public function getTotalPaid($loan_id) {
        $query = "SELECT SUM(amount + interest_amount) as total_paid 
                  FROM " . $this->table_name . " 
                  WHERE loan_id = :loan_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":loan_id", $loan_id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total_paid'] ? $row['total_paid'] : 0;
    }

    public function processRepayment($loan_id, $amount, $user_id) {
        try {
            $this->conn->beginTransaction();

            // Récupérer les informations du prêt
            $loan = new Loan($this->conn);
            $loan->id = $loan_id;
            $loan->readOne();

            // Calculer la part du principal et des intérêts
            $total_paid = $this->getTotalPaid($loan_id);
            $remaining_principal = $loan->amount - ($total_paid - $this->getTotalInterestPaid($loan_id));
            
            $interest_amount = min($amount * ($loan->interest_rate / 100), $loan->total_amount - $loan->amount - $this->getTotalInterestPaid($loan_id));
            $principal_amount = $amount - $interest_amount;

            // Vérifier qu'on ne rembourse pas plus que le principal restant
            $principal_amount = min($principal_amount, $remaining_principal);

            // Récupérer le portefeuille admin pour les intérêts
            $query = "SELECT wallet_address FROM users WHERE role = 'admin' LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $admin_wallet = $stmt->fetch(PDO::FETCH_ASSOC)['wallet_address'];

            // Récupérer le portefeuille de l'agent/caissier
            $query = "SELECT wallet_address FROM users WHERE id = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":user_id", $user_id);
            $stmt->execute();
            $agent_wallet = $stmt->fetch(PDO::FETCH_ASSOC)['wallet_address'];

            // Créer une transaction pour le remboursement du principal
            $transaction = new Transaction($this->conn);
            $transaction->sender_wallet = $loan->client_wallet;
            $transaction->receiver_wallet = $agent_wallet;
            $transaction->amount = $principal_amount;
            $transaction->transaction_type = 'remboursement';
            $transaction->description = 'Remboursement principal prêt #' . $loan_id;
            $transaction->created_by = $user_id;
            $transaction->status = 'approved';
            
            if (!$transaction->create() || !$transaction->executeTransaction()) {
                $this->conn->rollBack();
                return false;
            }

            $principal_transaction_id = $transaction->id;

            // Créer une transaction pour le paiement des intérêts (vers admin)
            if ($interest_amount > 0) {
                $transaction = new Transaction($this->conn);
                $transaction->sender_wallet = $loan->client_wallet;
                $transaction->receiver_wallet = $admin_wallet;
                $transaction->amount = $interest_amount;
                $transaction->transaction_type = 'interet';
                $transaction->description = 'Paiement intérêts prêt #' . $loan_id;
                $transaction->created_by = $user_id;
                $transaction->status = 'approved';
                
                if (!$transaction->create() || !$transaction->executeTransaction()) {
                    $this->conn->rollBack();
                    return false;
                }

                $interest_transaction_id = $transaction->id;
            }

            // Enregistrer le remboursement
            $this->loan_id = $loan_id;
            $this->amount = $principal_amount;
            $this->interest_amount = $interest_amount;
            $this->remaining_balance = $remaining_principal - $principal_amount;
            $this->transaction_id = $principal_transaction_id;

            if (!$this->create()) {
                $this->conn->rollBack();
                return false;
            }

            // Vérifier si le prêt est complètement remboursé
            $new_total_paid = $this->getTotalPaid($loan_id);
            if ($new_total_paid >= $loan->total_amount) {
                $loan->status = 'completed';
                $loan->updateStatus();
            }

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    private function getTotalInterestPaid($loan_id) {
        $query = "SELECT SUM(interest_amount) as total_interest 
                  FROM " . $this->table_name . " 
                  WHERE loan_id = :loan_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":loan_id", $loan_id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total_interest'] ? $row['total_interest'] : 0;
    }
}
?>