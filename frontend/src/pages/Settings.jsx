import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    agency_name: 'CMC-ATDR',
    agency_address: '',
    agency_phone: '',
    agency_email: '',
    currency: 'XOF',
    interest_rate_min: '1',
    interest_rate_max: '20',
    transaction_fee: '0'
  });

  useEffect(() => {
    // Charger les paramètres depuis le localStorage ou une API
    const savedSettings = localStorage.getItem('agency_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Sauvegarder les paramètres dans le localStorage ou via une API
    localStorage.setItem('agency_settings', JSON.stringify(settings));
    alert('Paramètres sauvegardés avec succès!');
  };

  return (
    <div className="settings">
      <h2>Paramètres de l'Agence</h2>
      
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Informations Générales</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Nom de l'Agence</label>
                      <input
                        type="text"
                        className="form-control"
                        name="agency_name"
                        value={settings.agency_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Téléphone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="agency_phone"
                        value={settings.agency_phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Adresse</label>
                  <textarea
                    className="form-control"
                    name="agency_address"
                    value={settings.agency_address}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="agency_email"
                    value={settings.agency_email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Devise</label>
                      <select 
                        className="form-select"
                        name="currency"
                        value={settings.currency}
                        onChange={handleInputChange}
                      >
                        <option value="XOF">XOF</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Taux d'intérêt Min (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="interest_rate_min"
                        value={settings.interest_rate_min}
                        onChange={handleInputChange}
                        min="1"
                        max="20"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Taux d'intérêt Max (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="interest_rate_max"
                        value={settings.interest_rate_max}
                        onChange={handleInputChange}
                        min="1"
                        max="20"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Frais de Transaction (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="transaction_fee"
                    value={settings.transaction_fee}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Sauvegarder les Paramètres
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Logo de l'Agence</h5>
            </div>
            <div className="card-body text-center">
              <img 
                src="/logo.png" 
                alt="Logo CMC-ATDR" 
                className="img-fluid mb-3"
                style={{maxHeight: '200px'}}
              />
              <div className="mb-3">
                <input type="file" className="form-control" accept="image/*" />
              </div>
              <button className="btn btn-outline-primary">
                Télécharger un nouveau logo
              </button>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-header">
              <h5>Export de Données</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-outline-secondary">
                  Exporter les Transactions (PDF)
                </button>
                <button className="btn btn-outline-secondary">
                  Exporter les Clients (Excel)
                </button>
                <button className="btn btn-outline-secondary">
                  Exporter les Prêts (CSV)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;