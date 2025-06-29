import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MessageCircle, BookOpen, TrendingUp, ArrowRight, Sparkles, Target, Trophy } from 'lucide-react';
import { fetchStudentDashboard } from '../../services/driveService';
import { getCurrentUser } from '../../services/authService';
import DriveCard from '../../components/DriveCard';
import QueryCard from '../../components/QueryCard';
import JourneyCard from '../../components/JourneyCard';
import CountUpCard from '../../components/CountUpCard';
import Loader from '../../components/Loader';
import ErrorBanner from '../../components/ErrorBanner';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await fetchStudentDashboard();
        setDashboardData(data);
      } catch (error) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleDriveClick = (driveId) => {
    navigate(`/drives/${driveId}`);
  };

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
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="h-8 w-8 text-yellow-300" />
              <h1 className="text-4xl font-bold">Hey {user.name?.split(' ')[0]}!</h1>
            </div>
            <p className="text-xl text-blue-100 mb-6">Are you ready to get placed? 🚀</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-300" />
                <span className="text-sm">Your placement journey starts here</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-300" />
                <span className="text-sm">Success awaits</span>
              </div>
            </div>
          </div>
        </div>

        <ErrorBanner message={error} onClose={() => setError('')} />

        {/* Stats Cards with CountUp */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <CountUpCard
            title="Upcoming Drives"
            value={dashboardData?.upcomingDrives?.length || 0}
            icon={Calendar}
            color="blue"
          />
          <CountUpCard
            title="Recent Queries"
            value={dashboardData?.recentPublicQueries?.length || 0}
            icon={MessageCircle}
            color="green"
          />
          <CountUpCard
            title="Journey Entries"
            value={dashboardData?.recentJourneys?.length || 0}
            icon={BookOpen}
            color="purple"
          />
          <CountUpCard
            title="Profile Score"
            value={85}
            icon={TrendingUp}
            color="orange"
            suffix="%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Drives */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Drives</h2>
              </div>
              <Link 
                to="/drives" 
                className="flex items-center space-x-2 text-primary-900 hover:text-primary-800 font-medium transition-colors duration-200"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData?.upcomingDrives?.slice(0, 3).map((drive) => (
                <div key={drive.id} className="transform hover:scale-105 transition-transform duration-200">
                  <DriveCard drive={drive} onClick={handleDriveClick} />
                </div>
              )) || (
                <div className="text-center py-8">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming drives</p>
                  <p className="text-sm text-gray-400 mt-1">Check back later for new opportunities</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Public Queries */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Recent Public Queries</h2>
              </div>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {dashboardData?.recentPublicQueries?.slice(0, 3).map((query) => (
                <div key={query.id} className="transform hover:scale-105 transition-transform duration-200">
                  <QueryCard query={query} />
                </div>
              )) || (
                <div className="text-center py-8">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent queries</p>
                  <p className="text-sm text-gray-400 mt-1">Be the first to ask a question</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Journeys */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Journey Entries</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dashboardData?.recentJourneys?.slice(0, 4).map((journey) => (
              <div key={journey.id} className="transform hover:scale-105 transition-transform duration-200">
                <JourneyCard journey={journey} />
              </div>
            )) || (
              <div className="col-span-2 text-center py-8">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent journeys</p>
                <p className="text-sm text-gray-400 mt-1">Share your interview experiences to help others</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;