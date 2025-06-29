import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { fetchDrives, deleteDrive } from '../../services/driveService';
import DriveCard from '../../components/DriveCard';
import FormInput from '../../components/FormInput';
import Loader from '../../components/Loader';
import ErrorBanner from '../../components/ErrorBanner';

const ManageDrivesPage = () => {
  const [drives, setDrives] = useState([]);
  const [filteredDrives, setFilteredDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadDrives = async () => {
      try {
        const data = await fetchDrives();
        setDrives(data.drives);
        setFilteredDrives(data.drives);
      } catch (error) {
        setError('Failed to load drives');
      } finally {
        setLoading(false);
      }
    };

    loadDrives();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = drives.filter(drive =>
        drive.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drive.batch.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDrives(filtered);
    } else {
      setFilteredDrives(drives);
    }
  }, [drives, searchTerm]);

  const handleDriveClick = (driveId) => {
    navigate(`/drives/${driveId}`);
  };

  const handleEditDrive = (driveId) => {
    navigate(`/admin/drives/${driveId}/edit`);
  };

  const handleDeleteDrive = async (driveId) => {
    if (window.confirm('Are you sure you want to delete this drive?')) {
      try {
        await deleteDrive(driveId);
        setDrives(drives.filter(drive => drive.id !== driveId));
      } catch (error) {
        setError('Failed to delete drive');
      }
    }
  };

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Drives</h1>
            <p className="text-gray-600 mt-2">Create, edit, and manage placement drives</p>
          </div>
          <Link
            to="/admin/drives/new"
            className="bg-primary-900 text-white px-6 py-3 rounded-xl hover:bg-primary-800 transition-colors duration-200 flex items-center shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Drive
          </Link>
        </div>

        <ErrorBanner message={error} onClose={() => setError('')} />

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="relative max-w-md">
            <FormInput
              placeholder="Search drives by company or batch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Drives Grid */}
        {filteredDrives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrives.map((drive) => (
              <DriveCard
                key={drive.id}
                drive={drive}
                onClick={handleDriveClick}
                showActions={true}
                onEdit={handleEditDrive}
                onDelete={handleDeleteDrive}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <p className="text-gray-500 text-lg">No drives found</p>
            <p className="text-gray-400 mt-2">
              {searchTerm ? 'Try adjusting your search criteria' : 'Create your first placement drive'}
            </p>
            {!searchTerm && (
              <Link
                to="/admin/drives/new"
                className="mt-4 inline-flex items-center bg-primary-900 text-white px-6 py-3 rounded-xl hover:bg-primary-800 transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Drive
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDrivesPage;