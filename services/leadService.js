import API from './api';

export const createLead = async (leadData) => {
  const res = await API.post('/leads', leadData);
  return res.data;
};

export const getLeads = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await API.get(`/admin/leads${params ? `?${params}` : ''}`);
  return res.data.leads;
};

export const updateLeadStatus = async (id, status) => {
  const res = await API.put(`/leads/${id}/status`, { status });
  return res.data.lead;
};

export const exportLeadsCSV = async () => {
  const res = await API.get('/leads/export', {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'leads.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
};



export const getLeadsByUser = async (userId) => {
  const res = await API.get(`/leads/user/${userId}`);
  return res.data.leads;
};

