import React, { useState } from 'react';
import { documentsAPI } from '../utils/api';

function AdvancedDocumentGenerator({ client, onClose }) {
  const [selectedDocument, setSelectedDocument] = useState('identification_receipt');
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [options, setOptions] = useState({
    include_logo: true,
    include_signature: true,
    include_qr_code: true,
    watermark: false,
    color_scheme: 'default'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const documentTypes = [
    {
      id: 'identification_receipt',
      name: 'Reçu d\'Identification',
      icon: 'bi-receipt',
      description: 'Document officiel d\'enregistrement du client'
    },
    {
      id: 'id_card',
      name: 'Carte d\'Identité',
      icon: 'bi-credit-card',
      description: 'Carte d\'identification format portefeuille'
    },
    {
      id: 'membership_certificate',
      name: 'Certificat de Membre',
      icon: 'bi-award',
      description: 'Certificat officiel de membre CMC-ATDR'
    },
    {
      id: 'financial_statement',
      name: 'Relevé Financier',
      icon: 'bi-graph-up',
      description: 'Relevé des transactions et solde'
    }
  ];

  const formatOptions = [
    { id: 'pdf', name: 'PDF', icon: 'bi-file-earmark-pdf' },
    { id: 'html', name: 'HTML', icon: 'bi-code' },
    { id: 'text', name: 'Texte', icon: 'bi-file-earmark-text' }
  ];

  const handleOptionChange = (option) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const generateDocument = async () => {
    setIsGenerating(true);
    try {
      await documentsAPI.generate({
        client_id: client.id,
        document_type: selectedDocument,
        format: selectedFormat,
        options: options
      });
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
    }
    setIsGenerating(false);
  };

  const generateAllDocuments = async () => {
    setIsGenerating(true);
    try {
      for (const docType of documentTypes) {
        await documentsAPI.generate({
          client_id: client.id,
          document_type: docType.id,
          format: selectedFormat,
          options: options
        });
        // Petit délai entre chaque génération
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Erreur lors de la génération en lot:', error);
    }
    setIsGenerating(false);
  };

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Génération de Documents - {client.first_name} {client.last_name}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="row">
              <div className="col-md-4">
                <div className="list-group">
                  {documentTypes.map(doc => (
                    <button
                      key={doc.id}
                      className={`list-group-item list-group-item-action ${selectedDocument === doc.id ? 'active' : ''}`}
                      onClick={() => setSelectedDocument(doc.id)}
                    >
                      <i className={`${doc.icon} me-2`}></i>
                      {doc.name}
                      <small className="d-block text-muted">{doc.description}</small>
                    </button>
                  ))}
                </div>

                <div className="mt-3">
                  <label className="form-label">Format de sortie</label>
                  <div className="btn-group w-100" role="group">
                    {formatOptions.map(format => (
                      <button
                        key={format.id}
                        type="button"
                        className={`btn btn-outline-primary ${selectedFormat === format.id ? 'active' : ''}`}
                        onClick={() => setSelectedFormat(format.id)}
                      >
                        <i className={`${format.icon} me-1`}></i>
                        {format.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">Options de Génération</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={options.include_logo}
                            onChange={() => handleOptionChange('include_logo')}
                          />
                          <label className="form-check-label">
                            Inclure le logo
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={options.include_signature}
                            onChange={() => handleOptionChange('include_signature')}
                          />
                          <label className="form-check-label">
                            Inclure signature
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={options.include_qr_code}
                            onChange={() => handleOptionChange('include_qr_code')}
                          />
                          <label className="form-check-label">
                            Inclure QR Code
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={options.watermark}
                            onChange={() => handleOptionChange('watermark')}
                          />
                          <label className="form-check-label">
                            Filigrane de sécurité
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="form-label">Schéma de couleurs</label>
                      <select
                        className="form-select"
                        value={options.color_scheme}
                        onChange={(e) => setOptions(prev => ({ ...prev, color_scheme: e.target.value }))}
                      >
                        <option value="default">Par défaut (Bleu)</option>
                        <option value="professional">Professionnel (Gris)</option>
                        <option value="premium">Premium (Or)</option>
                        <option value="minimal">Minimaliste</option>
                      </select>
                    </div>

                    <div className="mt-3">
                      <label className="form-label">Aperçu</label>
                      <div className="border rounded p-3 text-center document-preview">
                        <i className={`bi ${documentTypes.find(d => d.id === selectedDocument)?.icon} display-4 text-muted`}></i>
                        <p className="text-muted mt-2">
                          Aperçu du {documentTypes.find(d => d.id === selectedDocument)?.name}
                        </p>
                        <small className="text-muted">
                          Format: {selectedFormat.toUpperCase()}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isGenerating}
            >
              Annuler
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={generateDocument}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Génération...
                </>
              ) : (
                <>
                  <i className="bi bi-download me-2"></i>
                  Générer ce document
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={generateAllDocuments}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Génération...
                </>
              ) : (
                <>
                  <i className="bi bi-collection me-2"></i>
                  Générer tous les documents
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvancedDocumentGenerator;