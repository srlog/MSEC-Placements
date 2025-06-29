import axios from '../config/axiosConfig';

export const fetchQueriesByDrive = async (driveId, isPublic = false) => {
  const response = await axios.get(`/queries/drives/${driveId}/queries?public=${isPublic}`);
  return response.data;
};

export const fetchUnansweredQueries = async () => {
  const response = await axios.get('/queries/unanswered-queries');
  return response.data;
};

export const createQuery = async (driveId, queryData) => {
  const response = await axios.post(`/queries/drives/${driveId}/queries`, queryData);
  return response.data;
};

export const updateQuery = async (queryId, queryData) => {
  const response = await axios.put(`/queries/queries/${queryId}`, queryData);
  return response.data;
};

export const deleteQuery = async (queryId) => {
  const response = await axios.delete(`/queries/queries/${queryId}`);
  return response.data;
};