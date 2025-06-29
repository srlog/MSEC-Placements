import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { createDrive } from '../../services/driveService';
import { fetchCompanies } from '../../services/companyService';
import FormInput from '../../components/FormInput';
import Select from '../../components/Select';
import ErrorBanner from '../../components/ErrorBanner';
import Loader from '../../components/Loader';

const DriveFormPage = () => {
  const [formData, setFormData] = useState({
    company_id: '',
    batch: '',
    registration_deadline: '',
    test_date: '',
    interview_date: '',
    location: '',
    mode: ''
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await fetchCompanies();
        setCompanies(data.companies || []);
      } catch (error) {
        setError('Failed to load companies');
      } finally {
        setLoadingCompanies(false);
      }
    };

    loadCompanies();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createDrive(formData);
      navigate('/admin/drives', {
        state: { message: 'Drive created successfully!' }
      });
    } catch (error) {
      setError('Failed to create drive. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const companyOptions = companies.map(company => ({
    value: company.id,
    label: company.name
  }));

  const batchOptions = [
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
    { value: '2027', label: '2027' }
  ];

  const modeOptions = [
    { value: 'Online', label: 'Online' },
    { value: 'Offline', label: 'Offline' },
    { value: 'Hybrid', label: 'Hybrid' }
  ];

  if (loadingCompanies) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <button 
              onClick={() => navigate('/admin/drives')} 
              className="inline-flex items-center text-primary-900 hover:text-primary-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Drives
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Create New Drive</h1>
            <p className="text-gray-600 mt-2">Add a new placement drive for students</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <ErrorBanner message={error} onClose={() => setError('')} />

            <form onSubmit={handleSubmit} className="space-y-6">
              <Select
                label="Company"
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                options={companyOptions}
                required
              />

              <Select
                label="Batch"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                options={batchOptions}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Registration Deadline"
                  name="registration_deadline"
                  type="datetime-local"
                  value={formData.registration_deadline}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Test Date"
                  name="test_date"
                  type="datetime-local"
                  value={formData.test_date}
                  onChange={handleChange}
                />
              </div>

              <FormInput
                label="Interview Date"
                name="interview_date"
                type="datetime-local"
                value={formData.interview_date}
                onChange={handleChange}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location or 'Online'"
                />

                <Select
                  label="Mode"
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  options={modeOptions}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/admin/drives')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary-900 text-white px-6 py-2 rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                >
                  {loading ? (
                    <Loader size="sm" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Drive
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriveFormPage;