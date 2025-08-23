import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, GraduationCap, Award, Filter } from 'lucide-react';
import { fetchStudents } from '../../services/companyService';
import FormInput from '../../components/FormInput';
import Select from '../../components/Select';
import Loader from '../../components/Loader';
import ErrorBanner from '../../components/ErrorBanner';

const StudentsListPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    year: '',
    cgpaMin: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Load all students initially
    handleSearch();
  }, []);

  useEffect(() => {
    // Filter students based on search term
    if (searchTerm) {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.reg_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [students, searchTerm]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchStudents(filters);
      setStudents(data.students || []);
    } catch (error) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = (studentId) => {
    navigate(`/students/${studentId}`);
  };

const departmentOptions = [
    
    { value: 'IT', label: 'IT' },
    { value: 'CSE', label: 'CSE' },
    { value: 'ECE', label: 'ECE' },
    { value: 'EEE', label: 'EEE' },
    { value: 'MECH', label: 'Mechanical Engineering' },
    { value: 'CIVIL', label: 'Civil Engineering' },
  ];

  const yearOptions = [
    { value: '1', label: '1st Year' },
    { value: '2', label: '2nd Year' },
    { value: '3', label: '3rd Year' },
    { value: '4', label: '4th Year' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Students Directory</h1>
          <p className="text-gray-600 mt-2">Connect with your fellow students and explore their profiles</p>
        </div>

        <ErrorBanner message={error} onClose={() => setError('')} />

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <FormInput
                placeholder="Search by name, registration number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                label="Department"
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                options={departmentOptions}
                placeholder="All Departments"
              />

              <Select
                label="Year"
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                options={yearOptions}
                placeholder="All Years"
              />

              <FormInput
                label="Minimum CGPA"
                name="cgpaMin"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={filters.cgpaMin}
                onChange={handleFilterChange}
                placeholder="e.g., 7.5"
              />

              <div className="flex items-end space-x-2">
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-primary-900 text-white px-6 py-2 rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                >
                  {loading ? <Loader size="sm" /> : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setFilters({ department: '', year: '', cgpaMin: '' });
                    setSearchTerm('');
                  }}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => handleStudentClick(student.id)}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <Users className="h-8 w-8 text-primary-900" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.reg_no}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {student.department && (
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{student.department}</span>
                      {student.year && (
                        <span className="text-sm text-gray-600">- Year {student.year}</span>
                      )}
                    </div>
                  )}

                  {student.cgpa && (
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">CGPA: {student.cgpa}</span>
                    </div>
                  )}

                  {student.skills && student.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {student.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {skill.name || skill}
                        </span>
                      ))}
                      {student.skills.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{student.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-primary-900 font-medium text-sm hover:text-primary-800">
                    View Profile →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No students found</p>
            <p className="text-gray-400 mt-2">
              {searchTerm || Object.values(filters).some(f => f) 
                ? 'Try adjusting your search criteria' 
                : 'Start searching to find students'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsListPage;