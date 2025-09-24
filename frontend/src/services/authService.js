import axios from '../config/axiosConfig';

export const loginStudent = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  return {
    token: response.data.token,
    user: {
      ...response.data.student,
      role: 'student'
    }
  };
};

export const loginAdmin = async (credentials) => {
  const response = await axios.post('/auth/admin/login', credentials);
  return {
    token: response.data.token,
    user: {
      ...response.data.admin,
      role: 'admin'
    }
  };
};

export const login = async (credentials, userType = 'student') => {
  if (userType === 'admin') {
    return await loginAdmin(credentials);
  } else {
    return await loginStudent(credentials);
  }
};

export const register = async (userData) => {
  const response = await axios.post('/auth/register', userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};


export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user') || '{}');
};

export const setAuthData = (token, user) => {
  // Remove 'Bearer ' prefix if it exists
  const cleanToken = token.replace('Bearer ', '');
  localStorage.setItem('token', cleanToken);
  localStorage.setItem('user', JSON.stringify(user));
};