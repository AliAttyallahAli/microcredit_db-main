import React, { useState } from 'react';
import GenerateReceiptButton from './GenerateReceiptButton';
import AdvancedDocumentGenerator from './AdvancedDocumentGenerator';

function DocumentActionButtons({ client, showLabels = false }) {
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);

  return (
    <>
      <div className="document-action-buttons">
        {showLabels ? (
          <div className="row g-2">
            <div className="col-12">
              <GenerateReceiptButton 
                clientId={client.id} 
                clientName={`${client.first_name} ${client.last_name}`}
                type="receipt"
                variant="outline-primary"
                size="sm"
              />
              <span className="ms-2">Reçu d'Identification</span>
            </div>
            <div className="col-12">
              <GenerateReceiptButton 
                clientId={client.id} 
                clientName={`${client.first_name} ${client.last_name}`}
                type="idCard"
                variant="outline-success"
                size="sm"
              />
              <span className="ms-2">Carte d'Identité</span>
            </div>
            <div className="col-12">
              <GenerateReceiptButton 
                clientId={client.id} 
                clientName={`${client.first_name} ${client.last_name}`}
                type="certificate"
                variant="outline-warning"
                size="sm"
              />
              <span className="ms-2">Certificat</span>
            </div>
            <div className="col-12">
              <GenerateReceiptButton 
                clientId={client.id} 
                clientName={`${client.first_name} ${client.last_name}`}
                type="statement"
                variant="outline-info"
                size="sm"
              />
              <span className="ms-2">Relevé Financier</span>
            </div>
            <div className="col-12 mt-2">
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setShowAdvancedModal(true)}
              >
                <i className="bi bi-gear me-1"></i>
                Options Avancées
              </button>
            </div>
          </div>
        ) : (
          <div className="btn-group" role="group">
            <GenerateReceiptButton 
              clientId={client.id} 
              clientName={`${client.first_name} ${client.last_name}`}
              type="receipt"
              variant="outline-primary"
              size="sm"
            />
            <GenerateReceiptButton 
              clientId={client.id} 
              clientName={`${client.first_name} ${client.last_name}`}
              type="idCard"
              variant="outline-success"
              size="sm"
            />
            <GenerateReceiptButton 
              clientId={client.id} 
              clientName={`${client.first_name} ${client.last_name}`}
              type="certificate"
              variant="outline-warning"
              size="sm"
            />
            <GenerateReceiptButton 
              clientId={client.id} 
              clientName={`${client.first_name} ${client.last_name}`}
              type="statement"
              variant="outline-info"
              size="sm"
            />
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setShowAdvancedModal(true)}
              title="Options avancées de génération"
            >
              <i className="bi bi-gear"></i>
            </button>
          </div>
        )}
      </div>

      {showAdvancedModal && (
        <AdvancedDocumentGenerator 
          client={client}
          onClose={() => setShowAdvancedModal(false)}
        />
      )}
    </>
  );
}

export default DocumentActionButtons;