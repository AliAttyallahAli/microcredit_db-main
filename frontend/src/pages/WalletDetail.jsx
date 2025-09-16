import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { walletAPI, transactionsAPI } from '../utils/api';

function WalletDetail() {
  const { address } = useParams();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWalletData();
  }, [address]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer les données du portefeuille
      const walletData = await walletAPI.getByAddress(address);
      setWallet(walletData);
      
      // Récupérer les transactions du portefeuille
      try {
        const transactionsData = await transactionsAPI.getByWallet(address);
        setTransactions(transactionsData);
      } catch (transactionsError) {
        console.warn('Could not fetch transactions:', transactionsError);
        setTransactions([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setError('Erreur lors du chargement des données du portefeuille');
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchWalletData();
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement des données du portefeuille...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mx-3 mt-3">
        <div className="d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={refreshData}>
            <i className="bi bi-arrow-clockwise"></i> Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="alert alert-warning mx-3 mt-3">
        <div className="d-flex justify-content-between align-items-center">
          <span>Portefeuille non trouvé</span>
          <Link to="/transactions" className="btn btn-sm btn-outline-warning">
            <i className="bi bi-arrow-left"></i> Retour aux transactions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
        <h2>Détails du Portefeuille</h2>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={refreshData}>
            <i className="bi bi-arrow-clockwise"></i> Actualiser
          </button>
          <Link to="/transactions" className="btn btn-secondary">
            <i className="bi bi-arrow-left"></i> Retour aux transactions
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-wallet2 me-2"></i>
                Informations du Portefeuille
              </h5>
            </div>
            <div className="card-body">
              <div className="text-center mb-4">
                <div className="wallet-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{width: '80px', height: '80px', fontSize: '32px'}}>
                  <i className="bi bi-wallet2"></i>
                </div>
                <h4 className="mt-3 text-truncate">{address}</h4>
                <small className="text-muted">Adresse du portefeuille</small>
              </div>
              
              <div className="border-top pt-3">
                <div className="mb-3">
                  <strong className="text-muted">Solde:</strong>
                  <h3 className="text-success mb-0">{wallet.data.wallet_balance} XOF</h3>
                </div>
                
                <div className="mb-3">
                  <strong className="text-muted">Propriétaire:</strong>
                  <p className="mb-0">
                    {wallet.data.first_name} {wallet.data.last_name}
                    {wallet.type === 'user' && (
                      <span className="badge bg-info ms-2">{wallet.data.role}</span>
                    )}
                  </p>
                </div>
                
                {wallet.data.email && (
                  <div className="mb-3">
                    <strong className="text-muted">Email:</strong>
                    <p className="mb-0 text-truncate">{wallet.data.email}</p>
                  </div>
                )}
                
                {wallet.data.phone && (
                  <div className="mb-3">
                    <strong className="text-muted">Téléphone:</strong>
                    <p className="mb-0">{wallet.data.phone}</p>
                  </div>
                )}
                
                <div className="mb-3">
                  <strong className="text-muted">Statut:</strong>
                  <br />
                  <span className={`badge ${wallet.data.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                    {wallet.data.status?.toUpperCase() || 'INCONNU'}
                  </span>
                </div>
                
                <div className="mb-3">
                  <strong className="text-muted">Type:</strong>
                  <br />
                  <span className="badge bg-secondary">
                    {wallet.type?.toUpperCase() || 'INCONNU'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Historique des Transactions
                <span className="badge bg-primary ms-2">{transactions.length}</span>
              </h5>
            </div>
            <div className="card-body p-0">
              {transactions.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Référence</th>
                        <th>Type</th>
                        <th>Montant</th>
                        <th>Contrepartie</th>
                        <th>Statut</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(transaction => (
                        <tr key={transaction.id} className="align-middle">
                          <td>
                            <small className="text-muted">{transaction.transaction_ref}</small>
                          </td>
                          <td>
                            <span className={`badge ${
                              transaction.transaction_type === 'credit' || transaction.transaction_type === 'depot' ? 'bg-success' : 
                              transaction.transaction_type === 'debit' || transaction.transaction_type === 'retrait' ? 'bg-danger' : 'bg-info'
                            }`}>
                              {transaction.transaction_type}
                            </span>
                          </td>
                          <td>
                            <span className={
                              transaction.receiver_wallet === address ? 
                                'text-success fw-bold' : 
                                'text-danger fw-bold'
                            }>
                              {transaction.receiver_wallet === address ? '+' : '-'}
                              {parseFloat(transaction.amount).toLocaleString()} XOF
                            </span>
                          </td>
                          <td>
                            <Link 
                              to={`/wallet/${
                                transaction.sender_wallet === address ? 
                                transaction.receiver_wallet : 
                                transaction.sender_wallet
                              }`} 
                              className="text-decoration-none"
                            >
                              <small className="text-primary">
                                {transaction.sender_wallet === address ? 
                                  transaction.receiver_wallet : 
                                  transaction.sender_wallet
                                }
                              </small>
                            </Link>
                          </td>
                          <td>
                            <span className={`badge ${
                              transaction.status === 'approved' ? 'bg-success' : 
                              transaction.status === 'pending' ? 'bg-warning' : 'bg-danger'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td>
                            <small>
                              {new Date(transaction.created_at).toLocaleDateString()}
                              <br />
                              <span className="text-muted">
                                {new Date(transaction.created_at).toLocaleTimeString()}
                              </span>
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-inbox display-4"></i>
                  <p className="mt-3">Aucune transaction trouvée pour ce portefeuille</p>
                  <small>Les transactions apparaîtront ici une fois effectuées</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletDetail;