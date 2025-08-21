import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { fetchMyPortfolio, updateMyPortfolio } from '../../services/portfolioService';
import FormInput from '../../components/FormInput';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import SkillsManagement from '../../components/SkillsManagement';
import ErrorBanner from '../../components/ErrorBanner';
import Loader from '../../components/Loader';

const ProfileEditPage = () => {
  const [profile, setProfile] = useState({
    reg_no: '',
    name: '',
    gender: '',
    fathers_name: '',
    date_of_birth: '',
    residential_address: '',
    mobile: '',
    parents_mobile_no: '',
    aadhar_card_no: '',
    department: '',
    year: '',
    section: '',
    cgpa: '',
    bio: '',
    portfolio: '',
    github_profile: '',
    linkedin_profile: ''
  });
  const [studentSkills, setStudentSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchMyPortfolio();
        const student = data.student;
        setProfile({
          reg_no: student.reg_no || '',
          name: student.name || '',
          gender: student.gender || '',
          fathers_name: student.fathers_name || '',
          date_of_birth: student.date_of_birth ? student.date_of_birth.split('T')[0] : '',
          residential_address: student.residential_address || '',
          mobile: student.mobile || '',
          parents_mobile_no: student.parents_mobile_no || '',
          aadhar_card_no: student.aadhar_card_no || '',
          department: student.department || '',
          year: student.year || '',
          section: student.section || '',
          cgpa: parseFloat(student.cgpa) || 0,
          bio: student.bio || '',
          portfolio: student.portfolio || '',
          github_profile: student.github_profile || '',
          linkedin_profile: student.linkedin_profile || ''
        });
        setStudentSkills(student.skills || []);
      } catch (error) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await updateMyPortfolio(profile);
      navigate('/profile', { 
        state: { message: 'Profile updated successfully!' }
      });
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSkillsUpdate = async () => {
    try {
      const data = await fetchMyPortfolio();
      setStudentSkills(data.student.skills || []);
    } catch (error) {
      setError('Failed to refresh skills');
    }
  };

  const departmentOptions = [
    { value: 'CSE', label: 'Computer Science & Engineering' },
    { value: 'ECE', label: 'Electronics & Communication Engineering' },
    { value: 'EEE', label: 'Electrical & Electronics Engineering' },
    { value: 'MECH', label: 'Mechanical Engineering' },
    { value: 'CIVIL', label: 'Civil Engineering' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'AI&DS', label: 'Artificial Intelligence and Data Science' },
  ];
  const sectionOptions = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'Not Applicable', label: 'Not Applicable' },

  ];
  const yearOptions = [
    { value: 'I', label: '1st Year' },
    { value: 'II', label: '2nd Year' },
    { value: 'III', label: '3rd Year' },
    { value: 'IV', label: '4th Year' }
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

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
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button 
              onClick={() => navigate('/profile')} 
              className="inline-flex items-center text-primary-900 hover:text-primary-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600 mt-2">Update your information to improve your placement prospects</p>
          </div>

          <div className="space-y-8">
            <ErrorBanner message={error} onClose={() => setError('')} />

            {/* Basic Profile Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Registration Number"
                      name="reg_no"
                      value={profile.reg_no}
                      onChange={handleChange}
                      required
                    />

                    <FormInput
                      label="Full Name"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      required
                    />

                    <Select
                      label="Gender"
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                      options={genderOptions}
                    />

                    <FormInput
                      label="Father's Name"
                      name="fathers_name"
                      value={profile.fathers_name}
                      onChange={handleChange}
                    />

                    <FormInput
                      label="Date of Birth"
                      name="date_of_birth"
                      type="date"
                      value={profile.date_of_birth}
                      onChange={handleChange}
                    />

                    <FormInput
                      label="Mobile Number"
                      name="mobile"
                      value={profile.mobile}
                      onChange={handleChange}
                      type="tel"
                    />

                    <FormInput
                      label="Parent's Mobile Number"
                      name="parents_mobile_no"
                      value={profile.parents_mobile_no}
                      onChange={handleChange}
                      type="tel"
                    />

                    <FormInput
                      label="Aadhar Card Number"
                      name="aadhar_card_no"
                      value={profile.aadhar_card_no}
                      onChange={handleChange}
                    />
                  </div>

                  <Textarea
                    label="Residential Address"
                    name="residential_address"
                    value={profile.residential_address}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                {/* Academic Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Department"
                      name="department"
                      value={profile.department}
                      onChange={handleChange}
                      options={departmentOptions}
                    />

                    <Select
                      label="Year"
                      name="year"
                      value={profile.year}
                      onChange={handleChange}
                      options={yearOptions}
                    />

                    <Select
                      label="Section"
                      name="section"
                      value={profile.section}
                      onChange={handleChange}
                      options={sectionOptions}
                    />

                    <FormInput
                      label="CGPA"
                      name="cgpa"
                      value={profile.cgpa}
                      onChange={handleChange}
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
                  
                  <Textarea
                    label="Bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Portfolio URL"
                      name="portfolio"
                      value={profile.portfolio}
                      onChange={handleChange}
                      type="url"
                      placeholder="https://your-portfolio.com"
                    />

                    <FormInput
                      label="GitHub Profile"
                      name="github_profile"
                      value={profile.github_profile}
                      onChange={handleChange}
                      type="url"
                      placeholder="https://github.com/username"
                    />

                    <FormInput
                      label="LinkedIn Profile"
                      name="linkedin_profile"
                      value={profile.linkedin_profile}
                      onChange={handleChange}
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-primary-900 text-white px-6 py-2 rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                  >
                    {saving ? (
                      <Loader size="sm" />
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Skills Management */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <SkillsManagement 
                studentSkills={studentSkills}
                onSkillsUpdate={handleSkillsUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;