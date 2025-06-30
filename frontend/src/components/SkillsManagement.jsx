import { useState, useEffect } from 'react';
import { Plus, X, Edit2, ExternalLink } from 'lucide-react';
import { fetchSkills, createStudentSkill, deleteStudentSkill, updateStudentSkill } from '../services/skillsService';
import FormInput from './FormInput';
import Textarea from './Textarea';
import Select from './Select';
import Loader from './Loader';
import ErrorBanner from './ErrorBanner';

const SkillsManagement = ({ studentSkills = [], onSkillsUpdate }) => {
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    skill_id: '',
    description: '',
    proof_url: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await fetchSkills();
        setAvailableSkills(data.data || []);
      } catch (error) {
        setError('Failed to load available skills');
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.skill_id) return;

    setSubmitting(true);
    try {
      if (editingSkill) {
        await updateStudentSkill(editingSkill.id, formData);
      } else {
        await createStudentSkill(formData);
      }
      
      // Refresh skills list
      if (onSkillsUpdate) {
        onSkillsUpdate();
      }
      
      // Reset form
      setFormData({ skill_id: '', description: '', proof_url: '' });
      setShowAddForm(false);
      setEditingSkill(null);
    } catch (error) {
      setError('Failed to save skill');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      skill_id: skill.skill_id,
      description: skill.description || '',
      proof_url: skill.proof_url || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (skillId) => {
    if (window.confirm('Are you sure you want to remove this skill?')) {
      try {
        await deleteStudentSkill(skillId);
        if (onSkillsUpdate) {
          onSkillsUpdate();
        }
      } catch (error) {
        setError('Failed to delete skill');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ skill_id: '', description: '', proof_url: '' });
    setShowAddForm(false);
    setEditingSkill(null);
  };

  const skillOptions = availableSkills.map(skill => ({
    value: skill.id,
    label: skill.name
  }));

  const getSkillName = (skillId) => {
    const skill = availableSkills.find(s => s.id === skillId);

    return skill ? skill.name : 'Unknown Skill';
  };

  if (loading) {
    return <Loader size="md" />;
  }

  return (
    <div className="space-y-6">
      <ErrorBanner message={error} onClose={() => setError('')} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Skills & Expertise</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors duration-200 flex items-center text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
          <h4 className="font-medium text-gray-900 mb-4">
            {editingSkill ? 'Edit Skill' : 'Add New Skill'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Skill"
              name="skill_id"
              value={formData.skill_id}
              onChange={handleChange}
              options={skillOptions}
              placeholder="Select a skill"
              required
            />

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your experience with this skill, projects you've worked on, etc."
              rows={3}
            />

            <FormInput
              label="Proof URL (Optional)"
              name="proof_url"
              type="url"
              value={formData.proof_url}
              onChange={handleChange}
              placeholder="Link to portfolio, certificate, project, etc."
            />

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting || !formData.skill_id}
                className="bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {submitting ? <Loader size="sm" /> : (editingSkill ? 'Update' : 'Add Skill')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Skills List */}
      <div className="space-y-4">
        {studentSkills.length > 0 ? (
          studentSkills.map((skill) => (
            <div key={skill.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">
                       {skill.name}
                    </h4>
                    {skill.proof_url && (
                      <a
                        href={skill.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-900 hover:text-primary-800 transition-colors duration-200"
                        title="View Proof"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  {skill.description && (
                    <p className="text-gray-600 text-sm leading-relaxed">{skill.description}</p>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit Skill"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Remove Skill"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No skills added yet</p>
            <p className="text-sm text-gray-400 mt-1">Add your first skill to showcase your expertise</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsManagement;