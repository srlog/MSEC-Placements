import axios from '../config/axiosConfig';

export const fetchJourneysByDrive = async (driveId) => {
  const response = await axios.get(`/journeys/drives/${driveId}/journeys`);
  return response.data;
};
export const fetchAllJourneysByDrive = async (driveId) => {
  const response = await axios.get(`/journeys/drives/${driveId}/all/journeys`);
  return response.data;
};

export const createJourney = async (driveId, journeyData) => {
  const response = await axios.post(`/journeys/drives/${driveId}/journeys`, journeyData);
  return response.data;
};

export const updateJourney = async (journeyId, journeyData) => {
  const response = await axios.put(`/journeys/journeys/${journeyId}`, journeyData);
  return response.data;
};

export const deleteJourney = async (journeyId) => {
  const response = await axios.delete(`/journeys/journeys/${journeyId}`);
  return response.data;
};

export const fetchJourneyComments = async (journeyId) => {
  const response = await axios.get(`/comments/journeys/${journeyId}/comments`);
  return response.data;
};

export const createComment = async (journeyId, commentData) => {
  const response = await axios.post(`/comments/journeys/${journeyId}/comments`, commentData);
  return response.data;
};

export const updateComment = async (commentId, commentData) => {
  const response = await axios.put(`/comments/comments/${commentId}`, commentData);
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await axios.delete(`/comments/comments/${commentId}`);
  return response.data;
};