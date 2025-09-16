// src/utils/api.js

const BASE_URL = 'http://localhost:8000/api';

// Fonction utilitaire pour les appels API
async function fetchAPI(endpoint, options = {}) {
  const url = `${BASE_URL}/${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }

  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// ------------------- AUTHENTIFICATION -------------------
export const authAPI = {
  login: (username, password) => fetchAPI('auth.php', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),
};

// ------------------- UTILISATEURS -------------------
export const usersAPI = {
  getAll: () => fetchAPI('users.php'),
  getById: (id) => fetchAPI(`users.php?id=${id}`),
  create: (userData) => fetchAPI('users.php', { method: 'POST', body: JSON.stringify(userData) }),
  update: (id, userData) => fetchAPI(`users.php?id=${id}`, { method: 'PUT', body: JSON.stringify(userData) }),
  delete: (id) => fetchAPI(`users.php?id=${id}`, { method: 'DELETE' }),
};

// ------------------- CLIENTS -------------------
export const clientsAPI = {
  getAll: () => fetchAPI('clients.php'),
  getById: (id) => fetchAPI(`clients.php?id=${id}`),
  create: (clientData) => fetchAPI('clients.php', { method: 'POST', body: JSON.stringify(clientData) }),
  update: (id, clientData) => fetchAPI(`clients.php?id=${id}`, { method: 'PUT', body: JSON.stringify(clientData) }),
};

// ------------------- TRANSACTIONS -------------------
export const transactionsAPI = {
  getAll: () => fetchAPI('transactions.php'),
  create: (transactionData) => fetchAPI('transactions.php', { method: 'POST', body: JSON.stringify(transactionData) }),
  updateStatus: (id, status, validatedBy) => fetchAPI('transactions.php', { method: 'PUT', body: JSON.stringify({ id, status, validated_by: validatedBy }) }),
};

// ------------------- PRETS -------------------
export const loansAPI = {
  getAll: () => fetchAPI('loans.php'),
  getById: (id) => fetchAPI(`loans.php?id=${id}`),
  create: (loanData) => fetchAPI('loans.php', { method: 'POST', body: JSON.stringify(loanData) }),
  approve: (id, approvedBy) => fetchAPI('loans.php', { method: 'PUT', body: JSON.stringify({ id, status: 'approved', approved_by: approvedBy }) }),
  reject: (id, approvedBy) => fetchAPI('loans.php', { method: 'PUT', body: JSON.stringify({ id, status: 'rejected', approved_by: approvedBy }) }),
};

// ------------------- REMBOURSEMENTS -------------------
export const repaymentsAPI = {
  getByLoan: (loanId) => fetchAPI(`repayments.php?loan_id=${loanId}`),
  create: (repaymentData) => fetchAPI('repayments.php', { method: 'POST', body: JSON.stringify(repaymentData) }),
};

// ------------------- WALLET -------------------
export const walletAPI = {
  getByAddress: (address) => fetchAPI(`wallet.php?address=${address}`),
  transfer: (transferData) => fetchAPI('wallet.php', { method: 'POST', body: JSON.stringify({ action: 'transfer', ...transferData }) }),
  getBalance: (address) => fetchAPI('wallet.php', { method: 'POST', body: JSON.stringify({ action: 'get_balance', wallet_address: address }) }),
};

// ------------------- TEMPLATES DE DOCUMENTS -------------------
export const templatesAPI = {
  getAll: () => fetchAPI('document_templates.php'),
  getById: (id) => fetchAPI(`document_templates.php?id=${id}`),
  create: (templateData) => fetchAPI('document_templates.php', { method: 'POST', body: JSON.stringify(templateData) }),
  update: (id, templateData) => fetchAPI(`document_templates.php?id=${id}`, { method: 'PUT', body: JSON.stringify(templateData) }),
  delete: (id) => fetchAPI(`document_templates.php?id=${id}`, { method: 'DELETE' }),
};

// ------------------- DOCUMENTS / REÇUS -------------------
export const receiptsAPI = {
  downloadFile: (url, filename) => {
    const link = document.createElement('a');
    link.href = `${BASE_URL}/${url}`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  generateReceipt: (clientId) => receiptsAPI.downloadFile(`generate_receipt.php?client_id=${clientId}`, `reçu_client_${clientId}.pdf`),
  generateIDCard: (clientId) => receiptsAPI.downloadFile(`generate_id_card.php?client_id=${clientId}`, `carte_identification_${clientId}.pdf`),
  generateMembershipCertificate: (clientId) => receiptsAPI.downloadFile(`generate_certificate.php?client_id=${clientId}`, `certificat_membre_${clientId}.pdf`),
  generateFinancialStatement: (clientId) => receiptsAPI.downloadFile(`generate_statement.php?client_id=${clientId}`, `releve_financier_${clientId}.pdf`),
};

// ------------------- DOCUMENTS PERSONNALISES -------------------
export const documentsAPI = {
  generateDocument: (documentType, clientId) => {
    return new Promise((resolve) => {
      const link = document.createElement('a');
      link.href = `${BASE_URL}/documents/generate?type=${documentType}&clientId=${clientId}`;
      link.setAttribute('download', `${documentType}_${clientId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve();
    });
  },
  getDocumentHistory: (clientId) => fetchAPI(`documents/history?clientId=${clientId}`),
};

// ------------------- NOTIFICATIONS -------------------
export const notificationsAPI = {
  getByUser: (userId) => fetchAPI(`notifications.php?user_id=${userId}`),
  create: (notificationData) => fetchAPI('notifications.php', { method: 'POST', body: JSON.stringify(notificationData) }),
  markAsRead: (id) => fetchAPI('notifications.php', { method: 'PUT', body: JSON.stringify({ id }) }),
};

// ------------------- PARAMÈTRES -------------------
export const settingsAPI = {
  get: () => {
    const settings = localStorage.getItem('agency_settings');
    return settings ? JSON.parse(settings) : {};
  },
  save: (settings) => {
    localStorage.setItem('agency_settings', JSON.stringify(settings));
    return Promise.resolve({ success: true });
  },
};
// ------------------- RAPPORTS -------------------
export const reportsAPI = {
  generateTransactionReport: () => {
    const link = document.createElement('a');
    link.href = `${BASE_URL}/reports.php?type=transactions`;
    link.setAttribute('download', 'rapport_transactions.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  generateLoanReport: () => {
    const link = document.createElement('a');
    link.href = `${BASE_URL}/reports.php?type=loans`;
    link.setAttribute('download', 'rapport_prets.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};


// ------------------- EXPORT PAR DÉFAUT -------------------
export default fetchAPI;
