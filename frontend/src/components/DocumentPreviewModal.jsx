// src/components/DocumentPreviewModal.jsx
import React from 'react';

function DocumentPreviewModal({ documentType, client, onClose }) {
  const getDocumentTitle = () => {
    switch (documentType) {
      case 'identification':
        return "Reçu d'Identification";
      case 'idcard':
        return "Carte d'Identité";
      case 'certificate':
        return "Certificat de Membre";
      case 'statement':
        return "Relevé Financier";
      default:
        return "Document";
    }
  };

  const getDocumentIcon = () => {
    switch (documentType) {
      case 'identification':
        return '📋';
      case 'idcard':
        return '🪪';
      case 'certificate':
        return '🏅';
      case 'statement':
        return '💳';
      default:
        return '📄';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getDocumentIcon()}</span>
            <h2 className="text-xl font-semibold text-gray-900">
              {getDocumentTitle()} - {client.first_name} {client.last_name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            {/* En-tête du document */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                  CMC
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">CMC-ATDR</h1>
              <p className="text-gray-600">Agence de Microcrédit</p>
              <div className="w-32 h-1 bg-primary-600 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Titre du document */}
            <h2 className="text-xl font-semibold text-center text-gray-900 mb-8 border-b pb-4">
              {getDocumentTitle().toUpperCase()}
            </h2>

            {/* Informations du client */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Personnelles</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Nom complet:</span>
                    <p className="font-medium">{client.first_name} {client.last_name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Numéro d'identification:</span>
                    <p className="font-medium">{client.id_number}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="font-medium">{client.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Téléphone:</span>
                    <p className="font-medium">{client.phone}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Financières</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Portefeuille:</span>
                    <p className="font-medium text-sm">{client.wallet_address}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Solde actuel:</span>
                    <p className="font-medium text-primary-600">{client.wallet_balance} XOF</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Statut:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {client.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu spécifique au document */}
            {documentType === 'identification' && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Détails de l'Identification</h3>
                <p className="text-gray-700 mb-4">
                  Le présent document atteste que {client.first_name} {client.last_name} est officiellement enregistré(e) 
                  comme client de l'agence CMC-ATDR et bénéficie de tous les services de microcrédit proposés.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Référence: CMC-{client.id_number}-{new Date().getFullYear()}
                  </p>
                </div>
              </div>
            )}

            {documentType === 'statement' && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Relevé Financier</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">Solde initial:</span>
                      <p className="font-medium">0 XOF</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Solde actuel:</span>
                      <p className="font-medium text-primary-600">{client.wallet_balance} XOF</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Dernière mise à jour: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {/* Pied de page */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Signature du Client</p>
                  <div className="h-16 border-b border-gray-300"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Signature de l'Agent</p>
                  <div className="h-16 border-b border-gray-300"></div>
                </div>
              </div>
              <div className="text-center mt-6">
                <p className="text-xs text-gray-500">
                  Document généré le {new Date().toLocaleDateString()} | CMC-ATDR © {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            Fermer
          </button>
          <button
            onClick={() => documentsAPI.generateDocument(documentType, client.id)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            Télécharger le PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocumentPreviewModal;