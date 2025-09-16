import React, { useState, useEffect } from 'react';
import { usersAPI, clientsAPI } from '../utils/api';
import WalletCard from '../components/WalletCard';
import SearchBar from '../components/SearchBar';

function Wallets() {
  const [wallets, setWallets] = useState([]);
  const [filteredWallets, setFilteredWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const [usersData, clientsData] = await Promise.all([
        usersAPI.getAll(),
        clientsAPI.getAll()
      ]);

      // Transformer les données utilisateurs en format portefeuille
      const userWallets = usersData.map(user => ({
        type: user.role,
        name: `${user.first_name} ${user.last_name}`,
        address: user.wallet_address,
        balance: user.wallet_balance,
        email: user.email,
        status: user.status,
        originalData: user
      }));

      // Transformer les données clients en format portefeuille
      const clientWallets = clientsData.map(client => ({
        type: 'client',
        name: `${client.first_name} ${client.last_name}`,
        address: client.wallet_address,
        balance: client.wallet_balance,
        email: client.email,
        phone: client.phone,
        status: client.status,
        originalData: client
      }));

      const allWallets = [...userWallets, ...clientWallets];
      setWallets(allWallets);
      setFilteredWallets(allWallets);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    const filtered = wallets.filter(wallet =>
      wallet.name.toLowerCase().includes(query.toLowerCase()) ||
      wallet.address.toLowerCase().includes(query.toLowerCase()) ||
      wallet.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredWallets(filtered);
  };

  const filterWalletsByType = (type) => {
    if (type === 'all') return wallets;
    return wallets.filter(wallet => wallet.type === type);
  };

  const getWalletStats = () => {
    const stats = {
      total: wallets.length,
      admin: wallets.filter(w => w.type === 'admin').length,
      caissier: wallets.filter(w => w.type === 'caissier').length,
      agent: wallets.filter(w => w.type === 'agent').length,
      chef_operation: wallets.filter(w => w.type === 'chef_operation').length,
      client: wallets.filter(w => w.type === 'client').length,
      totalBalance: wallets.reduce((sum, wallet) => sum + parseFloat(wallet.balance), 0)
    };
    return stats;
  };

  const stats = getWalletStats();

  if (loading) return <div>Chargement des portefeuilles...</div>;

  return (
    <div className="wallets">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Portefeuilles</h2>
        <SearchBar onSearch={handleSearch} placeholder="Rechercher un portefeuille..." />
      </div>

      {/* Statistiques */}
      <div className="row mb-4">
        <div className="col-md-2">
          <div className="card text-white bg-primary">
            <div className="card-body text-center">
              <h5 className="card-title">{stats.total}</h5>
              <p className="card-text">Total Portefeuilles</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-white bg-info">
            <div className="card-body text-center">
              <h5 className="card-title">{stats.admin}</h5>
              <p className="card-text">Administrateurs</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-white bg-success">
            <div className="card-body text-center">
              <h5 className="card-title">{stats.caissier + stats.agent}</h5>
              <p className="card-text">Personnel</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-white bg-warning">
            <div className="card-body text-center">
              <h5 className="card-title">{stats.client}</h5>
              <p className="card-text">Clients</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-dark">
            <div className="card-body text-center">
              <h5 className="card-title">{stats.totalBalance.toLocaleString()} XOF</h5>
              <p className="card-text">Solde Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <ul className="nav nav-pills mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('all');
              setFilteredWallets(wallets);
            }}
          >
            Tous
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('admin');
              setFilteredWallets(filterWalletsByType('admin'));
            }}
          >
            Administrateurs
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'personnel' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('personnel');
              setFilteredWallets(wallets.filter(w => 
                w.type === 'caissier' || w.type === 'agent' || w.type === 'chef_operation'
              ));
            }}
          >
            Personnel
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'client' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('client');
              setFilteredWallets(filterWalletsByType('client'));
            }}
          >
            Clients
          </button>
        </li>
      </ul>

      {/* Liste des portefeuilles */}
      <div className="row">
        {filteredWallets.length > 0 ? (
          filteredWallets.map(wallet => (
            <div key={wallet.address} className="col-md-4 col-lg-3 mb-4">
              <WalletCard wallet={wallet} />
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="text-center py-5">
              <i className="bi bi-wallet2 display-1 text-muted"></i>
              <h5 className="text-muted mt-3">Aucun portefeuille trouvé</h5>
              <p className="text-muted">Aucun portefeuille ne correspond à votre recherche</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wallets;