import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { clientsAPI, transactionsAPI, loansAPI } from '../utils/api';
function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    clients: 0,
    transactions: 0,
    loans: 0,
    pendingTransactions: 0,
    pendingLoans: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [clientsRes, transactionsRes, loansRes] = await Promise.all([
        clientsAPI.getAll(),
        transactionsAPI.getAll(),
        loansAPI.getAll()
      ]);

      const pendingTransactions = transactionsRes.filter(t => t.status === 'pending').length;
      const pendingLoans = loansRes.filter(l => l.status === 'pending').length;

      setStats({
        clients: clientsRes.length,
        transactions: transactionsRes.length,
        loans: loansRes.length,
        pendingTransactions,
        pendingLoans
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="dashboard">
      <h2>Tableau de Bord - CMC-ATDR</h2>
      <div className="row">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Clients</h5>
              <p className="card-text">{stats.clients}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Transactions</h5>
              <p className="card-text">{stats.transactions}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-info mb-3">
            <div className="card-body">
              <h5 className="card-title">Prêts</h5>
              <p className="card-text">{stats.loans}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">En Attente</h5>
              <p className="card-text">{stats.pendingTransactions + stats.pendingLoans}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              Solde du Portefeuille
            </div>
            <div className="card-body">
              <h4>{user.wallet_balance} XOF</h4>
              <p className="text-muted">Adresse: {user.wallet_address}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              Actions Rapides
            </div>
            <div className="card-body">
              {(user.role === 'admin' || user.role === 'chef_operation') && (
                <>
                  <button className="btn btn-primary me-2">Nouveau Client</button>
                  <button className="btn btn-success me-2">Nouveau Prêt</button>
                </>
              )}
              {(user.role === 'caissier' || user.role === 'agent') && (
                <>
                  <button className="btn btn-primary me-2">Nouvelle Transaction</button>
                  <button className="btn btn-info me-2">Voir Historique</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;