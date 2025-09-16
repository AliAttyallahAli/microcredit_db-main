import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    wallet_address: '',
    wallet_balance: ''
  });

  useEffect(() => {
    if (user) {
      setUserData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        wallet_address: user.wallet_address,
        wallet_balance: user.wallet_balance
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous ajouterez la logique pour mettre à jour le profil
    alert('Profil mis à jour avec succès!');
  };

  if (!user) return null;

  return (
    <div className="profile">
      <h2>Mon Profil</h2>
      
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <img 
                src="/default-avatar.png" 
                alt="Avatar" 
                className="rounded-circle mb-3"
                width="120"
                height="120"
              />
              <h4>{user.first_name} {user.last_name}</h4>
              <p className="text-muted">{user.role}</p>
              
              <div className="wallet-info mt-4">
                <h5>Portefeuille</h5>
                <p className="text-primary">{user.wallet_balance} XOF</p>
                <small className="text-muted">{user.wallet_address}</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Informations Personnelles</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Prénom</label>
                      <input
                        type="text"
                        className="form-control"
                        name="first_name"
                        value={userData.first_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Nom</label>
                      <input
                        type="text"
                        className="form-control"
                        name="last_name"
                        value={userData.last_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Adresse du Portefeuille</label>
                  <input
                    type="text"
                    className="form-control"
                    value={userData.wallet_address}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Solde du Portefeuille</label>
                  <input
                    type="text"
                    className="form-control"
                    value={userData.wallet_balance + ' XOF'}
                    disabled
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Mettre à jour
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;