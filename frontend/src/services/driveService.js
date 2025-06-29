import axios from '../config/axiosConfig';

export const fetchDrives = async () => {
  const response = await axios.get('/drives/drives');
  return response.data;
};

export const fetchDriveById = async (driveId) => {
  const response = await axios.get(`/drives/drive/${driveId}`);
  return response.data;
};

export const createDrive = async (driveData) => {
  const response = await axios.post('/admin/drives', driveData);
  return response.data;
};

export const updateDrive = async (driveId, driveData) => {
  const response = await axios.put(`/admin/drives/${driveId}`, driveData);
  return response.data;
};

export const deleteDrive = async (driveId) => {
  const response = await axios.delete(`/admin/drives/${driveId}`);
  return response.data;
};

export const fetchStudentDashboard = async () => {
  const response = await axios.get('/students/students/dashboard');
  return response.data;
};