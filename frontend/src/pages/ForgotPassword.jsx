import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Simulation d'envoi d'email
    setTimeout(() => {
      setMessage('Un email de réinitialisation a été envoyé si l\'adresse existe dans notre système.');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="forgot-password-page min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: '80px', height: '80px'}}>
                    <i className="bi bi-key text-white" style={{fontSize: '2rem'}}></i>
                  </div>
                  <h2 className="card-title text-center">Mot de Passe Oublié</h2>
                  <p className="text-muted">Entrez votre email pour réinitialiser votre mot de passe</p>
                </div>

                {message && (
                  <div className="alert alert-info alert-dismissible fade show" role="alert">
                    {message}
                    <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label">Adresse Email</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      disabled={loading}
                    />
                    <div className="form-text">
                      Nous vous enverrons un lien de réinitialisation
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-warning btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Envoi...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>
                          Envoyer le lien
                        </>
                      )}
                    </button>

                    <Link to="/login" className="btn btn-outline-secondary">
                      <i className="bi bi-arrow-left me-2"></i>
                      Retour à la connexion
                    </Link>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <p className="text-muted">
                    &copy; 2024 CMC-ATDR. Tous droits réservés.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;