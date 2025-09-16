import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { loansAPI, clientsAPI } from '../utils/api';

function Loans() {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    client_id: '',
    amount: '',
    interest_rate: '5',
    duration: '30'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [loansData, clientsData] = await Promise.all([
        loansAPI.getAll(),
        clientsAPI.getAll()
      ]);

      setLoans(loansData);
      setClients(clientsData.filter(c => c.status === 'active'));
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

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const rate = parseFloat(formData.interest_rate) || 0;
    return amount + (amount * rate / 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loansAPI.create({
        ...formData,
        total_amount: calculateTotal(),
        created_by: user.id
      });
      setShowNewForm(false);
      setFormData({
        client_id: '',
        amount: '',
        interest_rate: '5',
        duration: '30'
      });
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error creating loan:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await loansAPI.approve(id, user.id);
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error approving loan:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await loansAPI.updateStatus(id, 'rejected');
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting loan:', error);
    }
  };

  if (loading) return <div>Chargement des prêts...</div>;

  return (
    <div className="loans">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Prêts</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowNewForm(true)}
        >
          Nouveau Prêt
        </button>
      </div>

      {showNewForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Nouveau Prêt</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Client</label>
                    <select 
                      className="form-select"
                      name="client_id"
                      value={formData.client_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Sélectionner un client</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.first_name} {client.last_name} - {client.wallet_address}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Montant du Prêt (XOF)</label>
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
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Taux d'Intérêt (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="interest_rate"
                      value={formData.interest_rate}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Durée (jours)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Montant Total</label>
                    <input
                      type="text"
                      className="form-control"
                      value={calculateTotal() + ' XOF'}
                      disabled
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
          <h5>Liste des Prêts</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Montant</th>
                  <th>Taux</th>
                  <th>Total</th>
                  <th>Durée</th>
                  <th>Statut</th>
                  <th>Créé par</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(loan => (
                  <tr key={loan.id}>
                    <td>{loan.client_name}</td>
                    <td>{loan.amount} XOF</td>
                    <td>{loan.interest_rate}%</td>
                    <td>{loan.total_amount} XOF</td>
                    <td>{loan.duration} jours</td>
                    <td>
                      <span className={`badge ${
                        loan.status === 'approved' ? 'bg-success' : 
                        loan.status === 'pending' ? 'bg-warning' : 'bg-danger'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td>{loan.creator_name}</td>
                    <td>{new Date(loan.created_at).toLocaleDateString()}</td>
                    <td>
                      {(user.role === 'admin' || user.role === 'chef_operation') && 
                       loan.status === 'pending' && (
                        <>
                          <button 
                            className="btn btn-sm btn-success me-1"
                            onClick={() => handleApprove(loan.id)}
                          >
                            Approuver
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleReject(loan.id)}
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

export default Loans;