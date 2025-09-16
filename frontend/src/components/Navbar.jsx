import React from 'react';
import { useAuth } from '../context/AuthContext';
import Notifications from './Notifications';

function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">
        CMC-ATDR
      </a>
      <button 
        className="navbar-toggler position-absolute d-md-none collapsed" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#sidebarMenu" 
        aria-controls="sidebarMenu" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      
      <div className="navbar-nav ms-auto">
        <div className="nav-item text-nowrap d-flex align-items-center">
          <Notifications />
          
          <div className="dropdown ms-3">
            <button 
              className="btn btn-outline-light dropdown-toggle" 
              type="button" 
              id="userDropdown" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              <img 
                src="/default-avatar.png" 
                alt="User" 
                width="32" 
                height="32" 
                className="rounded-circle me-2"
              />
              {user.first_name} {user.last_name}
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <a className="dropdown-item" href="#">
                  <i className="bi bi-person me-2"></i>
                  Profil
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <i className="bi bi-gear me-2"></i>
                  Paramètres
                </a>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Déconnexion
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;