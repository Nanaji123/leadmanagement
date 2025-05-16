import API from './api';

export const getAgents = async () => {
  const res = await API.get('/admin/agents');
  return res.data.agents;
};

export const getAgent = async (id) => {
  const res = await API.get(`/admin/agents/${id}`);
  return res.data.agent;
};

export const createAgent = async (agentData) => {
  const res = await API.post('/admin/agents', agentData);
  return res.data;
};

export const updateAgent = async (id, agentData) => {
  const res = await API.put(`/admin/agents/${id}`, agentData);
  return res.data;
};

export const deleteAgent = async (id) => {
  const res = await API.delete(`/admin/agents/${id}`);
  return res.data;
}; 