import axios from '../config/axiosConfig';

export const fetchSkills = async () => {
  const response = await axios.get('/skills');
  return response.data;
};

export const createSkill = async (skillData) => {
  const response = await axios.post('/skills', skillData);
  return response.data;
};

export const deleteSkill = async (skillId) => {
  const response = await axios.delete(`/skills/${skillId}`);
  return response.data;
};

export const createStudentSkill = async (studentSkillData) => {
  const response = await axios.post('/student-skills', studentSkillData);
  return response.data;
};

export const updateStudentSkill = async (studentSkillId, studentSkillData) => {
  const response = await axios.put(`/student-skills/${studentSkillId}`, studentSkillData);
  return response.data;
};

export const deleteStudentSkill = async (studentSkillId) => {
  const response = await axios.delete(`/student-skills/${studentSkillId}`);
  return response.data;
};