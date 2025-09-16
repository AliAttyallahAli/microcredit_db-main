// src/pages/Documents.jsx
import React, { useState, useEffect } from 'react';
import { clientsAPI, documentsAPI } from '../utils/api';
import DocumentCard from '../components/DocumentCard';
import SearchBar from '../components/SearchBar';
import DocumentPreviewModal from '../components/DocumentPreviewModal';

function Documents() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [generationStatus, setGenerationStatus] = useState({});

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await clientsAPI.getAll();
      setClients(data);
      setFilteredClients(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    const filtered = clients.filter(client =>
      client.first_name.toLowerCase().includes(query.toLowerCase()) ||
      client.last_name.toLowerCase().includes(query.toLowerCase()) ||
      client.id_number.toLowerCase().includes(query.toLowerCase()) ||
      client.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredClients(filtered);
  };

  const handleGenerateDocument = async (documentType, clientId) => {
    setGenerationStatus(prev => ({ ...prev, [documentType]: 'loading' }));
    
    try {
      await documentsAPI.generateDocument(documentType, clientId);
      setGenerationStatus(prev => ({ ...prev, [documentType]: 'success' }));
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setGenerationStatus(prev => ({ ...prev, [documentType]: '' }));
      }, 2000);
    } catch (error) {
      console.error('Error generating document:', error);
      setGenerationStatus(prev => ({ ...prev, [documentType]: 'error' }));
      
      setTimeout(() => {
        setGenerationStatus(prev => ({ ...prev, [documentType]: '' }));
      }, 2000);
    }
  };

  const handlePreview = (documentType) => {
    if (selectedClient) {
      setPreviewDocument({ type: documentType, client: selectedClient });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="documents-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Documents</h1>
        <p className="text-gray-600">Générez et gérez les documents officiels des clients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des clients */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Liste des Clients</h2>
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="Rechercher un client..." 
              />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredClients.map(client => (
                <div
                  key={client.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedClient?.id === client.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedClient(client)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {client.first_name} {client.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">{client.id_number}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {client.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="lg:col-span-2">
          {selectedClient ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Documents pour {selectedClient.first_name} {selectedClient.last_name}
                </h2>
                <p className="text-gray-600">ID: {selectedClient.id_number}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentCard
                  title="Reçu d'Identification"
                  description="Document officiel d'enregistrement du client"
                  icon="📋"
                  status={generationStatus.identification}
                  onGenerate={() => handleGenerateDocument('identification', selectedClient.id)}
                  onPreview={() => handlePreview('identification')}
                  client={selectedClient}
                />

                <DocumentCard
                  title="Carte d'Identité"
                  description="Carte d'identification format portefeuille"
                  icon="🪪"
                  status={generationStatus.idcard}
                  onGenerate={() => handleGenerateDocument('idcard', selectedClient.id)}
                  onPreview={() => handlePreview('idcard')}
                  client={selectedClient}
                />

                <DocumentCard
                  title="Certificat de Membre"
                  description="Certificat officiel de membre CMC-ATDR"
                  icon="🏅"
                  status={generationStatus.certificate}
                  onGenerate={() => handleGenerateDocument('certificate', selectedClient.id)}
                  onPreview={() => handlePreview('certificate')}
                  client={selectedClient}
                />

                <DocumentCard
                  title="Relevé Financier"
                  description="Relevé des transactions et solde actuel"
                  icon="💳"
                  status={generationStatus.statement}
                  onGenerate={() => handleGenerateDocument('statement', selectedClient.id)}
                  onPreview={() => handlePreview('statement')}
                  client={selectedClient}
                />
              </div>

              {/* Informations du client */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du Client</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedClient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-medium">{selectedClient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Portefeuille</p>
                    <p className="font-medium text-sm">{selectedClient.wallet_address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Solde</p>
                    <p className="font-medium text-primary-600">
                      {selectedClient.wallet_balance} XOF
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un client</h3>
              <p className="text-gray-600">Choisissez un client dans la liste pour afficher ses documents</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de prévisualisation */}
      {previewDocument && (
        <DocumentPreviewModal
          documentType={previewDocument.type}
          client={previewDocument.client}
          onClose={() => setPreviewDocument(null)}
        />
      )}
    </div>
  );
}

export default Documents;