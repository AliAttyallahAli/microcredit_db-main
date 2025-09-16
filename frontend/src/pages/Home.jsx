import React from 'react';
import { Link } from 'react-router-dom';
function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                CMC-ATDR
              </h1>
              <p className="lead mb-4">
                Système de Gestion de Microcrédit - Solution complète pour la gestion 
                des prêts, clients et transactions financières.
              </p>
              <div className="hero-buttons">
                <Link to="/login" className="btn btn-light btn-lg me-3">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Se connecter
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg">
                  <i className="bi bi-person-plus me-2"></i>
                  Créer un compte
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="hero-image">
                <i className="bi bi-graph-up-arrow display-1"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Fonctionnalités Principales</h2>
            <p className="lead text-muted">Découvrez toutes les fonctionnalités de notre système</p>
          </div>

          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: '80px', height: '80px'}}>
                    <i className="bi bi-people text-white" style={{fontSize: '2rem'}}></i>
                  </div>
                  <h5 className="card-title">Gestion des Clients</h5>
                  <p className="card-text">
                    Gérez efficacement vos clients avec des profils détaillés, 
                    des historiques de transactions et des portefeuilles numériques.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: '80px', height: '80px'}}>
                    <i className="bi bi-cash-coin text-white" style={{fontSize: '2rem'}}></i>
                  </div>
                  <h5 className="card-title">Gestion des Prêts</h5>
                  <p className="card-text">
                    Créez, suivez et gérez les prêts avec calcul automatique des intérêts 
                    et système de remboursement intégré.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-info rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: '80px', height: '80px'}}>
                    <i className="bi bi-graph-up text-white" style={{fontSize: '2rem'}}></i>
                  </div>
                  <h5 className="card-title">Rapports & Analytics</h5>
                  <p className="card-text">
                    Générez des rapports détaillés, analysez les performances et 
                    exportez les données en différents formats.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section bg-light py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <div className="stat-number display-4 fw-bold text-primary">500+</div>
                <div className="stat-label text-muted">Clients Actifs</div>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <div className="stat-number display-4 fw-bold text-success">1M+</div>
                <div className="stat-label text-muted">XOF de Prêts</div>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <div className="stat-number display-4 fw-bold text-info">99%</div>
                <div className="stat-label text-muted">Taux de Satisfaction</div>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <div className="stat-number display-4 fw-bold text-warning">24/7</div>
                <div className="stat-label text-muted">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>CMC-ATDR</h5>
              <p className="text-muted">
                Votre partenaire de confiance pour la gestion de microcrédit.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="text-muted mb-0">
                &copy; 2024 CMC-ATDR. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;