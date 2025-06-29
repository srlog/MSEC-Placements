import { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { fetchSkills, createSkill, deleteSkill } from '../../services/skillsService';
import FormInput from '../../components/FormInput';
import Select from '../../components/Select';
import ErrorBanner from '../../components/ErrorBanner';
import Loader from '../../components/Loader';

const ManageSkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await fetchSkills();
        setSkills(data.data || []);
        setFilteredSkills(data.data || []);
      } catch (error) {
        setError('Failed to load skills');
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = skills.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills(skills);
    }
  }, [skills, searchTerm]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    setSubmitting(true);
    try {
      const response = await createSkill(newSkill);
      setSkills([...skills, response.data]);
      setNewSkill({ name: '', category: '' });
    } catch (error) {
      setError('Failed to add skill');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteSkill(skillId);
        setSkills(skills.filter(skill => skill.id !== skillId));
      } catch (error) {
        setError('Failed to delete skill');
      }
    }
  };

  const categoryOptions = [
    { value: 'Programming', label: 'Programming' },
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Mobile Development', label: 'Mobile Development' },
    { value: 'Database', label: 'Database' },
    { value: 'Cloud', label: 'Cloud' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Design', label: 'Design' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Machine Learning', label: 'Machine Learning' },
    { value: 'Cybersecurity', label: 'Cybersecurity' },
    { value: 'Other', label: 'Other' }
  ];

  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    const category = skill.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Skills</h1>
          <p className="text-gray-600 mt-2">Add and organize skill categories for students</p>
        </div>

        <ErrorBanner message={error} onClose={() => setError('')} />

        {/* Add New Skill */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Skill</h2>
          <form onSubmit={handleAddSkill} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Skill Name"
                name="name"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="e.g., React, Python, Machine Learning"
                required
              />
              <Select
                label="Category"
                name="category"
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                options={categoryOptions}
                placeholder="Select a category"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !newSkill.name.trim()}
              className="bg-primary-900 text-white px-6 py-2 rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
            >
              {submitting ? (
                <Loader size="sm" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </>
              )}
            </button>
          </form>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="relative max-w-md">
            <FormInput
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Skills List */}
        <div className="space-y-6">
          {Object.keys(groupedSkills).length > 0 ? (
            Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete Skill"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <p className="text-gray-500 text-lg">No skills found</p>
              <p className="text-gray-400 mt-2">
                {searchTerm ? 'Try adjusting your search criteria' : 'Add your first skill to get started'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSkillsPage;