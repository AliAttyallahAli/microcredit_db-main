import React from 'react';
import { Link } from 'react-router-dom';

function WalletCard({ wallet, showDetails = true }) {
  const getWalletIcon = (type) => {
    switch (type) {
      case 'admin': return 'bi-shield-check';
      case 'caissier': return 'bi-cash-coin';
      case 'agent': return 'bi-person-check';
      case 'chef_operation': return 'bi-person-gear';
      case 'client': return 'bi-person';
      default: return 'bi-wallet2';
    }
  };

  const getWalletBadge = (type) => {
    switch (type) {
      case 'admin': return 'danger';
      case 'caissier': return 'success';
      case 'agent': return 'info';
      case 'chef_operation': return 'warning';
      case 'client': return 'secondary';
      default: return 'primary';
    }
  };

  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className={`wallet-icon bg-${getWalletBadge(wallet.type)} text-white rounded-circle d-inline-flex align-items-center justify-content-center`} 
               style={{width: '50px', height: '50px', fontSize: '1.2rem'}}>
            <i className={`bi ${getWalletIcon(wallet.type)}`}></i>
          </div>
          
          <span className={`badge bg-${getWalletBadge(wallet.type)}`}>
            {wallet.type}
          </span>
        </div>

        <h6 className="card-title text-truncate">{wallet.name}</h6>
        
        <div className="mb-2">
          <small className="text-muted">Adresse:</small>
          <div className="text-truncate" style={{maxWidth: '200px'}}>
            <small>{wallet.address}</small>
          </div>
        </div>

        <div className="mb-2">
          <small className="text-muted">Solde:</small>
          <h5 className="text-primary mb-0">{wallet.balance} XOF</h5>
        </div>

        {showDetails && (
          <>
            <div className="mb-2">
              <small className="text-muted">Email:</small>
              <div className="text-truncate" style={{maxWidth: '200px'}}>
                <small>{wallet.email}</small>
              </div>
            </div>

            {wallet.phone && (
              <div className="mb-2">
                <small className="text-muted">Téléphone:</small>
                <div>
                  <small>{wallet.phone}</small>
                </div>
              </div>
            )}

            <div className="mb-3">
              <small className="text-muted">Statut:</small>
              <span className={`badge ${wallet.status === 'active' ? 'bg-success' : 'bg-danger'} ms-1`}>
                {wallet.status}
              </span>
            </div>
          </>
        )}

        <div className="d-grid gap-2">
          <Link 
            to={`/wallet/${wallet.address}`} 
            className="btn btn-outline-primary btn-sm"
          >
            <i className="bi bi-eye me-1"></i>
            Voir Détails
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WalletCard;