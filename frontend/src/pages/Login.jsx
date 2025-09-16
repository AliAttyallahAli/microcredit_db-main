import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger si l'utilisateur est déjà connecté
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Échec de la connexion');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                {/* Logo et en-tête */}
                <div className="text-center mb-4">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: '80px', height: '80px'}}>
                    <i className="bi bi-shield-check text-white" style={{fontSize: '2rem'}}></i>
                    <div className='cmc-logo'>
                      <img
                       
               />
                    </div>
                  </div>
                  <h2 className="card-title text-center">CMC-ATDR</h2>
                  <p className="text-muted">Système de Gestion de Microcrédit</p>
                </div>

                {/* Messages d'erreur */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                  </div>
                )}

                {/* Formulaire de connexion */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      <i className="bi bi-person me-1"></i>
                      Nom d'utilisateur
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Entrez votre nom d'utilisateur"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      <i className="bi bi-lock me-1"></i>
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Entrez votre mot de passe"
                      required
                      disabled={loading}
                    />
                    <div className="form-text">
                      <Link to="/forgot-password" className="text-decoration-none">
                        Mot de passe oublié ?
                      </Link>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Connexion...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Se connecter
                      </>
                    )}
                  </button>
                </form>

                {/* Séparateur */}
                <div className="text-center my-4">
                  <span className="text-muted">ou</span>
                </div>

                {/* Comptes de démonstration */}
                <div className="demo-accounts">
                  <h6 className="text-center mb-3">Comptes de démonstration:</h6>
                  <div className="row g-2">
                    <div className="col-6">
                      <button
                        className="btn btn-outline-primary w-100 btn-sm"
                        onClick={() => setFormData({ username: 'admin', password: 'password' })}
                        type="button"
                      >
                        Admin
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        className="btn btn-outline-success w-100 btn-sm"
                        onClick={() => setFormData({ username: 'caissier1', password: 'password' })}
                        type="button"
                      >
                        Caissier
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        className="btn btn-outline-info w-100 btn-sm"
                        onClick={() => setFormData({ username: 'agent1', password: 'password' })}
                        type="button"
                      >
                        Agent
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        className="btn btn-outline-warning w-100 btn-sm"
                        onClick={() => setFormData({ username: 'chef1', password: 'password' })}
                        type="button"
                      >
                        Chef Op.
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pied de page */}
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

export default Login;