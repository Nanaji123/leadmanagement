import API from './api';

export const getUserProfile = async () => {
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');
  
  if (userRole === 'admin') {
    const res = await API.get(`/admin/profile/${userId}`);
    return res.data.admin;
  } else {
    const res = await API.get(`/agents/${userId}/profile`);
    return res.data.agent;
  }
};

export const updateUserProfile = async (userData) => {
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');
  
  if (userRole === 'admin') {
    const res = await API.put(`/admin/profile/${userId}`, userData);
    return res.data;
  } else {
    const res = await API.put(`/agents/${userId}/profile`, userData);
    return res.data;
  }
};

export const changePassword = async (passwordData) => {
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');
  
  if (userRole === 'admin') {
    const res = await API.put(`/admin/profile/${userId}/password`, passwordData);
    return res.data;
  } else {
    const res = await API.put(`/agents/${userId}/password`, passwordData);
    return res.data;
  }
}; 