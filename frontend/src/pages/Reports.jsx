import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionsAPI, loansAPI, clientsAPI, reportsAPI } from '../utils/api';

function Reports() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('transactions');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    client: '',
    type: ''
  });
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await clientsAPI.getAll();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
      if (activeTab === 'transactions') {
        const data = await transactionsAPI.getAll();
        let filteredData = data;

        // Appliquer les filtres
        if (filters.startDate) {
          filteredData = filteredData.filter(t => new Date(t.created_at) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
          filteredData = filteredData.filter(t => new Date(t.created_at) <= new Date(filters.endDate));
        }
        if (filters.client) {
          filteredData = filteredData.filter(t => 
            t.sender_wallet === filters.client || t.receiver_wallet === filters.client
          );
        }
        if (filters.type) {
          filteredData = filteredData.filter(t => t.transaction_type === filters.type);
        }

        setTransactions(filteredData);
      } else if (activeTab === 'loans') {
        const data = await loansAPI.getAll();
        let filteredData = data;

        // Appliquer les filtres
        if (filters.startDate) {
          filteredData = filteredData.filter(l => new Date(l.created_at) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
          filteredData = filteredData.filter(l => new Date(l.created_at) <= new Date(filters.endDate));
        }
        if (filters.client) {
          filteredData = filteredData.filter(l => l.client_id == filters.client);
        }

        setLoans(filteredData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const generatePDF = async () => {
    try {
      if (activeTab === 'transactions') {
        await reportsAPI.generateTransactionReport();
      } else if (activeTab === 'loans') {
        await reportsAPI.generateLoanReport();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const exportCSV = () => {
    let csvContent = '';
    
    if (activeTab === 'transactions') {
      csvContent = 'Référence,Expéditeur,Destinataire,Montant,Type,Statut,Date\n';
      transactions.forEach(t => {
        csvContent += `"${t.transaction_ref}","${t.sender_wallet}","${t.receiver_wallet}",${t.amount},${t.transaction_type},${t.status},${t.created_at}\n`;
      });
    } else if (activeTab === 'loans') {
      csvContent = 'Client,Montant,Taux,Montant Total,Durée,Statut,Date\n';
      loans.forEach(l => {
        csvContent += `"${l.client_name}",${l.amount},${l.interest_rate},${l.total_amount},${l.duration},${l.status},${l.created_at}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `rapport_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="reports">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Rapports et Statistiques</h2>
        <div>
          <button className="btn btn-primary me-2" onClick={generatePDF}>
            <i className="bi bi-file-earmark-pdf me-1"></i>
            Exporter PDF
          </button>
          <button className="btn btn-success" onClick={exportCSV}>
            <i className="bi bi-file-earmark-spreadsheet me-1"></i>
            Exporter CSV
          </button>
        </div>
      </div>

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'loans' ? 'active' : ''}`}
            onClick={() => setActiveTab('loans')}
          >
            Prêts
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistiques
          </button>
        </li>
      </ul>

      <div className="card mt-3">
        <div className="card-header">
          <h5>Filtres</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <div className="mb-3">
                <label className="form-label">Date de début</label>
                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label className="form-label">Date de fin</label>
                <input
                  type="date"
                  className="form-control"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label className="form-label">Client</label>
                <select 
                  className="form-select"
                  name="client"
                  value={filters.client}
                  onChange={handleFilterChange}
                >
                  <option value="">Tous les clients</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.wallet_address}>
                      {client.first_name} {client.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {activeTab === 'transactions' && (
              <div className="col-md-3">
                <div className="mb-3">
                  <label className="form-label">Type de transaction</label>
                  <select 
                    className="form-select"
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                  >
                    <option value="">Tous les types</option>
                    <option value="transfert">Transfert</option>
                    <option value="remboursement">Remboursement</option>
                    <option value="depot">Dépôt</option>
                    <option value="credit">Crédit</option>
                    <option value="frais">Frais</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <button className="btn btn-primary" onClick={applyFilters}>
            Appliquer les filtres
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : (
        <div className="card mt-4">
          <div className="card-body">
            {activeTab === 'transactions' && (
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
                      <th>Date</th>
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
                        <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {transactions.length === 0 && (
                  <p className="text-center text-muted mt-3">Aucune transaction trouvée</p>
                )}
              </div>
            )}

            {activeTab === 'loans' && (
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
                      <th>Date</th>
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
                        <td>{new Date(loan.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {loans.length === 0 && (
                  <p className="text-center text-muted mt-3">Aucun prêt trouvé</p>
                )}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="row">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <h6>Statistiques des Transactions</h6>
                    </div>
                    <div className="card-body">
                      <canvas id="transactionStats" width="400" height="200"></canvas>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <h6>Répartition des Prêts</h6>
                    </div>
                    <div className="card-body">
                      <canvas id="loanStats" width="400" height="200"></canvas>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;