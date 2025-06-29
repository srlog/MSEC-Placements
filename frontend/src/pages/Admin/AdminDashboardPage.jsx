import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageCircle, BookOpen, Users, TrendingUp, Clock, Plus, ArrowRight } from 'lucide-react';
import { fetchAdminDashboard } from '../../services/companyService';
import { getCurrentUser } from '../../services/authService';
import CountUpCard from '../../components/CountUpCard';
import Loader from '../../components/Loader';
import ErrorBanner from '../../components/ErrorBanner';

const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await fetchAdminDashboard();
        setDashboardData(data);
      } catch (error) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 bg-gradient-to-r from-primary-900 to-blue-800 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 border-2 border-white transform rotate-45"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-xl text-blue-100 mb-6">Manage placement drives and monitor student activities</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-300" />
                <span className="text-sm">Empowering student success</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-yellow-300" />
                <span className="text-sm">Driving placement excellence</span>
              </div>
            </div>
          </div>
        </div>

        <ErrorBanner message={error} onClose={() => setError('')} />

        {/* Stats Cards with CountUp */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <CountUpCard
            title="Total Drives"
            value={dashboardData?.drives || 0}
            icon={Calendar}
            color="blue"
          />
          <CountUpCard
            title="Pending Queries"
            value={dashboardData?.pendingQueries || 0}
            icon={MessageCircle}
            color="orange"
          />
          <CountUpCard
            title="Total Journeys"
            value={dashboardData?.totalJourneys || 0}
            icon={BookOpen}
            color="green"
          />
          <CountUpCard
            title="Total Queries"
            value={dashboardData?.totalQueries || 0}
            icon={BookOpen}
            color="green"
          />
          
          
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/drives/new"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 transform hover:scale-105 group"
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors duration-200">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Create New Drive</h3>
            </div>
            <p className="text-gray-600">Add a new placement drive for companies</p>
            <div className="flex items-center mt-4 text-primary-900 font-medium">
              <span>Get started</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>

          <Link
            to="/admin/queries"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 transform hover:scale-105 group"
          >
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 p-3 rounded-xl group-hover:bg-orange-200 transition-colors duration-200">
                <MessageCircle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Manage Queries</h3>
            </div>
            <p className="text-gray-600">Review and respond to student queries</p>
            <div className="flex items-center mt-4 text-primary-900 font-medium">
              <span>Review now</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>

          <Link
            to="/admin/journeys"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 transform hover:scale-105 group"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors duration-200">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Review Journeys</h3>
            </div>
            <p className="text-gray-600">Approve student journey experiences</p>
            <div className="flex items-center mt-4 text-primary-900 font-medium">
              <span>Review now</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>

          <Link
            to="/admin/drives"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:scale-105 group"
          >
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors duration-200">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Manage Drives</h3>
            </div>
            <p className="text-gray-600">View and edit existing placement drives</p>
            <div className="flex items-center mt-4 text-primary-900 font-medium">
              <span>Manage</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>

          <Link
            to="/admin/students"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:scale-105 group"
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors duration-200">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Student Shortlist</h3>
            </div>
            <p className="text-gray-600">Search and filter student profiles</p>
            <div className="flex items-center mt-4 text-primary-900 font-medium">
              <span>Search</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>

          <Link
            to="/admin/skills"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 transform hover:scale-105 group"
          >
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-3 rounded-xl group-hover:bg-red-200 transition-colors duration-200">
                <Clock className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Manage Skills</h3>
            </div>
            <p className="text-gray-600">Add and manage skill categories</p>
            <div className="flex items-center mt-4 text-primary-900 font-medium">
              <span>Manage</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">New drive created: TCS Campus Hiring</p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">5 new queries require attention</p>
                  <p className="text-sm text-gray-600">4 hours ago</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">3 journey experiences pending approval</p>
                  <p className="text-sm text-gray-600">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;