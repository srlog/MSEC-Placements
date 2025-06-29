import { useState, useEffect } from 'react';
import { Search, Download, Filter } from 'lucide-react';
import { fetchStudents } from '../../services/companyService';
import FormInput from '../../components/FormInput';
import Select from '../../components/Select';
import Loader from '../../components/Loader';
import ErrorBanner from '../../components/ErrorBanner';

const StudentShortlistPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    cgpaMin: '',
    skills: '',
    arrearsMax: '',
    department: '',
    year: ''
  });

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

  const handleExport = () => {
    // Create CSV content
    const headers = ['Name', 'Registration No', 'Email', 'Department', 'CGPA', 'Year', 'Skills'];
    const csvContent = [
      headers.join(','),
      ...students.map(student => [
        student.name,
        student.reg_no,
        student.email,
        student.department || '',
        student.cgpa || '',
        student.year || '',
        (student.skills || []).map(skill => skill.name || skill).join('; ')
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_shortlist.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const departmentOptions = [
    { value: 'CSE', label: 'Computer Science & Engineering' },
    { value: 'ECE', label: 'Electronics & Communication Engineering' },
    { value: 'EEE', label: 'Electrical & Electronics Engineering' },
    { value: 'MECH', label: 'Mechanical Engineering' },
    { value: 'CIVIL', label: 'Civil Engineering' },
    { value: 'IT', label: 'Information Technology' }
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
          <h1 className="text-3xl font-bold text-gray-900">Student Shortlist</h1>
          <p className="text-gray-600 mt-2">Search and filter student profiles for placement drives</p>
        </div>

        <ErrorBanner message={error} onClose={() => setError('')} />

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Students</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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

            <FormInput
              label="Skills (comma separated)"
              name="skills"
              value={filters.skills}
              onChange={handleFilterChange}
              placeholder="e.g., Java, Python, React"
            />

            <FormInput
              label="Maximum Arrears"
              name="arrearsMax"
              type="number"
              min="0"
              value={filters.arrearsMax}
              onChange={handleFilterChange}
              placeholder="e.g., 0"
            />

            <Select
              label="Department"
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              options={departmentOptions}
            />

            <Select
              label="Year"
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              options={yearOptions}
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setFilters({
                cgpaMin: '',
                skills: '',
                arrearsMax: '',
                department: '',
                year: ''
              })}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </button>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-primary-900 text-white px-6 py-2 rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
            >
              {loading ? (
                <Loader size="sm" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search Students
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {students.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Search Results ({students.length} students)
              </h2>
              <button
                onClick={handleExport}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CGPA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.reg_no}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.department || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.cgpa || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.year || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(student.skills || []).slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {skill.name || skill}
                            </span>
                          ))}
                          {(student.skills || []).length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{(student.skills || []).length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {students.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No students found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentShortlistPage;