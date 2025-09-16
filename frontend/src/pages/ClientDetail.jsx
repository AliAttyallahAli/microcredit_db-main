import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clientsAPI, transactionsAPI, loansAPI } from '../utils/api';
import DocumentActionButtons from '../components/DocumentActionButtons';

function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const fetchClientData = async () => {
    try {
      const [clientData, transactionsData, loansData] = await Promise.all([
        clientsAPI.getById(id),
        transactionsAPI.getAll(),
        loansAPI.getAll()
      ]);

      setClient(clientData);
      
      const clientTransactions = transactionsData.filter(
        t => t.sender_wallet === clientData.wallet_address || 
             t.receiver_wallet === clientData.wallet_address
      );
      setTransactions(clientTransactions);
      
      const clientLoans = loansData.filter(l => l.client_id == id);
      setLoans(clientLoans);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching client data:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement des détails du client...</div>;
  if (!client) return <div>Client non trouvé</div>;

  return (
    <div className="client-detail">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Détails du Client</h2>
        <Link to="/clients" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-1"></i>
          Retour à la liste
        </Link>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <img 
                src={client.photo || '/default-avatar.png'} 
                alt={client.first_name} 
                className="rounded-circle mb-3"
                width="120"
                height="120"
              />
              <h4>{client.first_name} {client.last_name}</h4>
              <p className="text-muted">{client.email}</p>
              
              <div className="d-flex justify-content-center mb-3">
                <span className={`badge ${client.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                  {client.status}
                </span>
              </div>
              
              <div className="wallet-info mb-3">
                <h5>Portefeuille</h5>
                <p className="text-primary fs-4">{client.wallet_balance} XOF</p>
                <small className="text-muted">{client.wallet_address}</small>
              </div>

              {/* Boutons de génération de documents */}
              <div className="mt-4">
                <h6>Génération de Documents</h6>
                <DocumentActionButtons client={client} showLabels={false} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                <i className="bi bi-info-circle me-1"></i>
                Informations
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}
                onClick={() => setActiveTab('transactions')}
              >
                <i className="bi bi-arrow-left-right me-1"></i>
                Transactions
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'loans' ? 'active' : ''}`}
                onClick={() => setActiveTab('loans')}
              >
                <i className="bi bi-cash-coin me-1"></i>
                Prêts
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveTab('documents')}
              >
                <i className="bi bi-folder me-1"></i>
                Documents
              </button>
            </li>
          </ul>

          <div className="tab-content mt-3">
            {activeTab === 'details' && (
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Email:</strong> {client.email}</p>
                      <p><strong>Téléphone:</strong> {client.phone}</p>
                      <p><strong>CNI:</strong> {client.id_number}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Adresse:</strong> {client.address}</p>
                      <p><strong>Créé par:</strong> {client.creator_name}</p>
                      <p><strong>Date création:</strong> {new Date(client.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="card">
                <div className="card-body">
                  <h5>Historique des Transactions</h5>
                  {/* Contenu des transactions */}
                </div>
              </div>
            )}

            {activeTab === 'loans' && (
              <div className="card">
                <div className="card-body">
                  <h5>Historique des Prêts</h5>
                  {/* Contenu des prêts */}
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="card">
                <div className="card-body">
                  <h5>Documents du Client</h5>
                  <DocumentActionButtons client={client} showLabels={true} />
                  
                  <div className="mt-4">
                    <h6>Documents Générés</h6>
                    <div className="list-group">
                      <div className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <i className="bi bi-file-earmark-pdf text-danger me-2"></i>
                            Reçu d'Identification.pdf
                          </div>
                          <small className="text-muted">12/01/2024</small>
                        </div>
                      </div>
                      <div className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <i className="bi bi-file-earmark-pdf text-danger me-2"></i>
                            Carte d'Identité.pdf
                          </div>
                          <small className="text-muted">12/01/2024</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDetail;