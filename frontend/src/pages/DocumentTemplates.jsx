import React, { useState, useEffect } from 'react';
import { templatesAPI } from '../utils/api';

function DocumentTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await templatesAPI.getAll();
      setTemplates(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (templateData) => {
    try {
      await templatesAPI.create(templateData);
      setShowCreateModal(false);
      fetchTemplates();
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleEditTemplate = async (templateData) => {
    try {
      await templatesAPI.update(editingTemplate.id, templateData);
      setEditingTemplate(null);
      fetchTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  if (loading) return <div>Chargement des modèles...</div>;

  return (
    <div className="document-templates">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Modèles de Documents</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Nouveau Modèle
        </button>
      </div>

      <div className="row">
        {templates.map(template => (
          <div key={template.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="mb-0">{template.name}</h6>
                <small className="text-muted">{template.type}</small>
              </div>
              <div className="card-body">
                <p className="card-text">{template.description}</p>
                <div className="mb-2">
                  <span className={`badge ${template.is_active ? 'bg-success' : 'bg-secondary'}`}>
                    {template.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
              <div className="card-footer">
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setEditingTemplate(template)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-sm btn-outline-success">
                    <i className="bi bi-eye"></i>
                  </button>
                  <button className="btn btn-sm btn-outline-danger">
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <TemplateEditor
          onSave={handleCreateTemplate}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {editingTemplate && (
        <TemplateEditor
          template={editingTemplate}
          onSave={handleEditTemplate}
          onClose={() => setEditingTemplate(null)}
        />
      )}
    </div>
  );
}

function TemplateEditor({ template, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    type: template?.type || 'identification_receipt',
    description: template?.description || '',
    content: template?.content || '',
    is_active: template?.is_active ?? true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {template ? 'Modifier le Modèle' : 'Nouveau Modèle'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Nom du Modèle</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Type de Document</label>
                    <select
                      className="form-select"
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      required
                    >
                      <option value="identification_receipt">Reçu d'Identification</option>
                      <option value="id_card">Carte d'Identité</option>
                      <option value="membership_certificate">Certificat de Membre</option>
                      <option value="financial_statement">Relevé Financier</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows="2"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contenu du Modèle</label>
                <textarea
                  className="form-control"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows="10"
                  required
                />
                <div className="form-text">
                  Utilisez les variables: {{client_name}}, {{client_id}}, {{date}}, etc.
                </div>
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                />
                <label className="form-check-label">
                  Modèle actif
                </label>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              {template ? 'Modifier' : 'Créer'} le Modèle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentTemplates;