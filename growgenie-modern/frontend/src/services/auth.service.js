import api from './api';

const login = (email, password) => {
  return api.post('/auth/signin', { email, password })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    });
};

const register = (name, email, password) => {
  return api.post('/auth/signup', { name, email, password });
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
};
