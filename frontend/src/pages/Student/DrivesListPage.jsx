import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { fetchDrives } from '../../services/driveService';
import DriveCard from '../../components/DriveCard';
import Loader from '../../components/Loader';
import ErrorBanner from '../../components/ErrorBanner';
import FormInput from '../../components/FormInput';
import Select from '../../components/Select';

const DrivesListPage = () => {
  const [drives, setDrives] = useState([]);
  const [filteredDrives, setFilteredDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
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
    let filtered = drives;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(drive =>
        drive.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter) {
      const now = new Date();
      filtered = filtered.filter(drive => {
        const isOpen = new Date(drive.registration_deadline) > now;
        return statusFilter === 'open' ? isOpen : !isOpen;
      });
    }

    // Filter by batch
    if (batchFilter) {
      filtered = filtered.filter(drive => drive.batch === batchFilter);
    }

    setFilteredDrives(filtered);
  }, [drives, searchTerm, statusFilter, batchFilter]);

  const handleDriveClick = (driveId) => {
    navigate(`/drives/${driveId}`);
  };

  const statusOptions = [
    { value: 'open', label: 'Open for Registration' },
    { value: 'closed', label: 'Registration Closed' }
  ];

  const batchOptions = [
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Placement Drives</h1>
          <p className="text-gray-600 mt-2">Browse and register for upcoming placement opportunities</p>
        </div>

        <ErrorBanner message={error} onClose={() => setError('')} />

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FormInput
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
            </div>
            
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
            
            <Select
              placeholder="Filter by batch"
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              options={batchOptions}
            />
            
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setBatchFilter('');
              }}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </button>
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
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No drives found matching your criteria</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or check back later</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrivesListPage;