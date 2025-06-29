import axios from '../config/axiosConfig';

export const fetchMyPortfolio = async () => {
  const response = await axios.get('/portfolio/portfolio/me');
  return response.data;
};

export const fetchStudentPortfolio = async (studentId) => {
  const response = await axios.get(`/portfolio/portfolio/${studentId}`);
  return response.data;
};

export const updateMyPortfolio = async (portfolioData) => {
  const response = await axios.put('/portfolio/portfolio/me', portfolioData);
  return response.data;
};

export const deleteStudentPortfolio = async (studentId) => {
  const response = await axios.delete(`/portfolio/portfolio/${studentId}`);
  return response.data;
};