import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../utils/api';

function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'caissier',
    first_name: '',
    last_name: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await usersAPI.getAll();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await usersAPI.create(formData);
      setShowNewForm(false);
      setFormData({
        username: '',
        password: '',
        email: '',
        role: 'caissier',
        first_name: '',
        last_name: ''
      });
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await usersAPI.update(userId, { status: newStatus });
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  if (loading) return <div>Chargement des utilisateurs...</div>;

  return (
    <div className="users">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Utilisateurs</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowNewForm(true)}
        >
          Nouvel Utilisateur
        </button>
      </div>

      {showNewForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Nouvel Utilisateur</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Nom d'utilisateur</label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Mot de passe</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Rôle</label>
                    <select 
                      className="form-select"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="caissier">Caissier</option>
                      <option value="agent">Agent</option>
                      <option value="chef_operation">Chef d'Opération</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Prénom</label>
                    <input
                      type="text"
                      className="form-control"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
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
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button 
                  type="button" 
                  className="btn btn-secondary me-2"
                  onClick={() => setShowNewForm(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h5>Liste des Utilisateurs</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nom d'utilisateur</th>
                  <th>Nom Complet</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Solde</th>
                  <th>Statut</th>
                  <th>Date création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(userItem => (
                  <tr key={userItem.id}>
                    <td>{userItem.username}</td>
                    <td>{userItem.first_name} {userItem.last_name}</td>
                    <td>{userItem.email}</td>
                    <td>
                      <span className="badge bg-info">{userItem.role}</span>
                    </td>
                    <td>{userItem.wallet_balance} XOF</td>
                    <td>
                      <span className={`badge ${userItem.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                        {userItem.status}
                      </span>
                    </td>
                    <td>{new Date(userItem.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-sm btn-info me-1">Modifier</button>
                      <button 
                        className="btn btn-sm btn-warning me-1"
                        onClick={() => handleStatusChange(
                          userItem.id, 
                          userItem.status === 'active' ? 'inactive' : 'active'
                        )}
                      >
                        {userItem.status === 'active' ? 'Désactiver' : 'Activer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;