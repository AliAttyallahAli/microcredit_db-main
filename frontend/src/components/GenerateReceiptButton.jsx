import React from 'react';
import { receiptsAPI } from '../utils/api';

function GenerateReceiptButton({ clientId, clientName, type = 'receipt', variant = 'primary', size = 'sm' }) {
  const generateDocument = async () => {
    try {
      switch (type) {
        case 'receipt':
          await receiptsAPI.generateReceipt(clientId);
          break;
        case 'idCard':
          await receiptsAPI.generateIDCard(clientId);
          break;
        case 'certificate':
          await receiptsAPI.generateMembershipCertificate(clientId);
          break;
        case 'statement':
          await receiptsAPI.generateFinancialStatement(clientId);
          break;
        default:
          await receiptsAPI.generateReceipt(clientId);
      }
    } catch (error) {
      console.error('Error generating document:', error);
      alert(`Erreur lors de la génération du document: ${error.message}`);
    }
  };

  const getButtonText = () => {
    switch (type) {
      case 'receipt':
        return 'Reçu';
      case 'idCard':
        return 'Carte';
      case 'certificate':
        return 'Certificat';
      case 'statement':
        return 'Relevé';
      default:
        return 'Document';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'receipt':
        return 'bi-receipt';
      case 'idCard':
        return 'bi-credit-card';
      case 'certificate':
        return 'bi-award';
      case 'statement':
        return 'bi-graph-up';
      default:
        return 'bi-file-earmark';
    }
  };

  const getTooltip = () => {
    switch (type) {
      case 'receipt':
        return `Générer le reçu d'identification pour ${clientName}`;
      case 'idCard':
        return `Générer la carte d'identification pour ${clientName}`;
      case 'certificate':
        return `Générer le certificat de membre pour ${clientName}`;
      case 'statement':
        return `Générer le relevé financier pour ${clientName}`;
      default:
        return `Générer le document pour ${clientName}`;
    }
  };

  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={generateDocument}
      title={getTooltip()}
      data-bs-toggle="tooltip"
      data-bs-placement="top"
    >
      <i className={`bi ${getIcon()} me-1`}></i>
      {getButtonText()}
    </button>
  );
}

export default GenerateReceiptButton;