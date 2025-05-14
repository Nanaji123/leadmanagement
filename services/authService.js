import API from './api';

export const register = async ({ email, password, role }) => {
  const res = await API.post('/auth/register', { email, password, role });
  return res.data;
};

export const login = async ({ email, password }) => {
  const res = await API.post('/auth/login', { email, password });
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', res.data.role);
  }
  return res.data;
};

export const logout = async () => {
  const res = await API.post('/auth/logout');
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
  return res.data;
};
