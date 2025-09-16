import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    // Simulation de réinitialisation
    setTimeout(() => {
      setMessage('Votre mot de passe a été réinitialisé avec succès!');
      setLoading(false);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }, 2000);
  };

  return (
    <div className="reset-password-page min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: '80px', height: '80px'}}>
                    <i className="bi bi-shield-check text-white" style={{fontSize: '2rem'}}></i>
                  </div>
                  <h2 className="card-title text-center">Nouveau Mot de Passe</h2>
                  <p className="text-muted">Choisissez un nouveau mot de passe</p>
                </div>

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                  </div>
                )}

                {message && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Nouveau mot de passe</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Entrez votre nouveau mot de passe"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirmez votre nouveau mot de passe"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Réinitialisation...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Réinitialiser
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

export default ResetPassword;