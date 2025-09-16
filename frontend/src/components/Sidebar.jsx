import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/" className={isActive('/')}>
              <i className="bi bi-speedometer2 me-2"></i>
              Tableau de Bord
            </Link>
          </li>
          
          {(user.role === 'admin' || user.role === 'chef_operation') && (
            <>
              <li className="nav-item">
                <Link to="/clients" className={isActive('/clients')}>
                  <i className="bi bi-people me-2"></i>
                  Clients
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/users" className={isActive('/users')}>
                  <i className="bi bi-person-badge me-2"></i>
                  Utilisateurs
                </Link>
              </li>
            </>
          )}
          
          <li className="nav-item">
            <Link to="/transactions" className={isActive('/transactions')}>
              <i className="bi bi-arrow-left-right me-2"></i>
              Transactions
            </Link>
          </li>
          
          <li className="nav-item">
            <Link to="/loans" className={isActive('/loans')}>
              <i className="bi bi-cash-coin me-2"></i>
              Prêts
            </Link>
          </li>
          
          <li className="nav-item">
            <Link to="/reports" className={isActive('/reports')}>
              <i className="bi bi-graph-up me-2"></i>
              Rapports
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/wallets" className={isActive('/wallets')}>
              <i className="bi bi-wallet2 me-2"></i>
              Portefeuilles
            </Link>
          </li>
        <li className="nav-item">
            <Link to="/documents" className={isActive('/documents')}>
             <i className="bi bi-file-earmark-text me-2"></i>
             Documents
            </Link>
            </li>
          <li className="nav-item">
            <Link to="/settings" className={isActive('/settings')}>
              <i className="bi bi-gear me-2"></i>
              Paramètres
            </Link>
          </li>
        </ul>

        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Compte</span>
        </h6>
        <ul className="nav flex-column mb-2">
          <li className="nav-item">
            <Link to="/profile" className={isActive('/profile')}>
              <i className="bi bi-person me-2"></i>
              Mon Profil
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Sidebar;