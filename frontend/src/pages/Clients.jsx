import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientsAPI } from '../utils/api';

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await clientsAPI.getAll();
      setClients(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement des clients...</div>;

  return (
    <div className="clients">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Clients</h2>
        <button className="btn btn-primary">Nouveau Client</button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Solde</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td>
                  <img 
                    src={client.photo || '/default-avatar.png'} 
                    alt={client.first_name} 
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                </td>
                <td>
                  <Link to={`/clients/${client.id}`}>
                    {client.first_name} {client.last_name}
                  </Link>
                </td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.wallet_balance} XOF</td>
                <td>
                  <span className={`badge ${client.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                    {client.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-info me-1">Modifier</button>
                  <button className="btn btn-sm btn-danger">Désactiver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Clients;