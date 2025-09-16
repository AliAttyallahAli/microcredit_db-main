import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionsAPI, clientsAPI, usersAPI } from '../utils/api';

function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    sender_wallet: '',
    receiver_wallet: '',
    amount: '',
    transaction_type: 'transfert',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsData, clientsData, usersData] = await Promise.all([
        transactionsAPI.getAll(),
        clientsAPI.getAll(),
        usersAPI.getAll()
      ]);

      setTransactions(transactionsData);
      setClients(clientsData);
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await transactionsAPI.create({
        ...formData,
        created_by: user.id
      });
      setShowNewForm(false);
      setFormData({
        sender_wallet: '',
        receiver_wallet: '',
        amount: '',
        transaction_type: 'transfert',
        description: ''
      });
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await transactionsAPI.updateStatus(id, 'approved', user.id);
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error approving transaction:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await transactionsAPI.updateStatus(id, 'rejected', user.id);
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting transaction:', error);
    }
  };

  if (loading) return <div>Chargement des transactions...</div>;

  return (
    <div className="transactions">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Transactions</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowNewForm(true)}
        >
          Nouvelle Transaction
        </button>
      </div>

      {showNewForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Nouvelle Transaction</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Portefeuille Expéditeur</label>
                    <select 
                      className="form-select"
                      name="sender_wallet"
                      value={formData.sender_wallet}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Sélectionner un portefeuille</option>
                      <optgroup label="Utilisateurs">
                        {users.map(u => (
                          <option key={u.wallet_address} value={u.wallet_address}>
                            {u.first_name} {u.last_name} - {u.wallet_address} ({u.wallet_balance} XOF)
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Clients">
                        {clients.map(c => (
                          <option key={c.wallet_address} value={c.wallet_address}>
                            {c.first_name} {c.last_name} - {c.wallet_address} ({c.wallet_balance} XOF)
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Portefeuille Destinataire</label>
                    <select 
                      className="form-select"
                      name="receiver_wallet"
                      value={formData.receiver_wallet}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Sélectionner un portefeuille</option>
                      <optgroup label="Utilisateurs">
                        {users.map(u => (
                          <option key={u.wallet_address} value={u.wallet_address}>
                            {u.first_name} {u.last_name} - {u.wallet_address}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Clients">
                        {clients.map(c => (
                          <option key={c.wallet_address} value={c.wallet_address}>
                            {c.first_name} {c.last_name} - {c.wallet_address}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Montant (XOF)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Type de Transaction</label>
                    <select 
                      className="form-select"
                      name="transaction_type"
                      value={formData.transaction_type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="transfert">Transfert</option>
                      <option value="remboursement">Remboursement</option>
                      <option value="depot">Dépôt</option>
                      <option value="credit">Crédit</option>
                      <option value="frais">Frais</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button 
                  type="button" 
                  className="btn btn-secondary me-2"
                  onClick={() => setShowNewForm(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h5>Historique des Transactions</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Expéditeur</th>
                  <th>Destinataire</th>
                  <th>Montant</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Créée par</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.transaction_ref}</td>
                    <td>
                      <small>{transaction.sender_wallet}</small>
                    </td>
                    <td>
                      <small>{transaction.receiver_wallet}</small>
                    </td>
                    <td>{transaction.amount} XOF</td>
                    <td>
                      <span className="badge bg-info">{transaction.transaction_type}</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        transaction.status === 'approved' ? 'bg-success' : 
                        transaction.status === 'pending' ? 'bg-warning' : 'bg-danger'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td>{transaction.creator_name}</td>
                    <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                    <td>
                      {(user.role === 'admin' || user.role === 'chef_operation') && 
                       transaction.status === 'pending' && (
                        <>
                          <button 
                            className="btn btn-sm btn-success me-1"
                            onClick={() => handleApprove(transaction.id)}
                          >
                            Approuver
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleReject(transaction.id)}
                          >
                            Rejeter
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transactions;