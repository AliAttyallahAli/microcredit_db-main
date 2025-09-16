import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found-page min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 text-center">
            <div className="error-container">
              <div className="error-code display-1 text-primary fw-bold">404</div>
              <div className="error-icon mb-4">
                <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
              </div>
              <h1 className="error-title h2 mb-3">Page Non Trouvée</h1>
              <p className="error-message lead text-muted mb-4">
                Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
              </p>
              
              <div className="error-actions">
                <Link to="/" className="btn btn-primary btn-lg me-3">
                  <i className="bi bi-house me-2"></i>
                  Retour à l'accueil
                </Link>
                <Link to="/login" className="btn btn-outline-secondary btn-lg">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Se connecter
                </Link>
              </div>

              <div className="error-search mt-5">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Rechercher</h5>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Que cherchez-vous ?"
                      />
                      <button className="btn btn-primary" type="button">
                        <i className="bi bi-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-muted">
                  &copy; 2024 CMC-ATDR. Tous droits réservés.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;