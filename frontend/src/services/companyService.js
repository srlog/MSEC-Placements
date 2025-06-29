import axios from '../config/axiosConfig';

export const fetchCompanies = async () => {
  const response = await axios.get('/companies/all');
  return response.data;
};

export const fetchCompanyById = async (companyId) => {
  const response = await axios.get(`/companies/company/${companyId}`);
  return response.data;
};

export const fetchStudents = async (filters = {}) => {
  const params = new URLSearchParams();
  
  // Map frontend filter names to backend expected names
  if (filters.cgpaMin) params.append('cgpaMin', filters.cgpaMin);
  if (filters.cgpaMax) params.append('cgpaMax', filters.cgpaMax);
  if (filters.skills) params.append('skills', filters.skills);
  if (filters.arrearsMax) params.append('arrearsMax', filters.arrearsMax);
  if (filters.department) params.append('department', filters.department);
  if (filters.year) params.append('year', filters.year);
  
  const response = await axios.get(`/admin/students?${params}`);
  return response.data;
};

export const fetchAdminDashboard = async () => {
  const response = await axios.get('/admin/dashboard');
  return response.data;
};

export const createCompany = async (companyData) => {
  const response = await axios.post('/companies/company', companyData);
  return response.data;
};

export const updateCompany = async (companyId, companyData) => {
  const response = await axios.put(`/companies/company/${companyId}`, companyData);
  return response.data;
};

export const deleteCompany = async (companyId) => {
  const response = await axios.delete(`/companies/company/${companyId}`);
  return response.data;
};