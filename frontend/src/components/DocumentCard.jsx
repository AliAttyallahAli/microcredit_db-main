// src/components/DocumentCard.jsx
import React from 'react';

function DocumentCard({ title, description, icon, status, onGenerate, onPreview, client }) {
  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>;
      case 'success':
        return <span>✓</span>;
      case 'error':
        return <span>✗</span>;
      default:
        return null;
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'loading':
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-xl">
          {icon}
        </div>
        {status && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}>
            {getStatusIcon()}
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>

      <div className="space-y-2">
        <button
          onClick={onGenerate}
          disabled={status === 'loading'}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {status === 'loading' ? 'Génération...' : 'Générer le PDF'}
        </button>
        
        <button
          onClick={onPreview}
          className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          Aperçu
        </button>
      </div>
    </div>
  );
}

export default DocumentCard;