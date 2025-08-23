import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Building, Users, MessageCircle, BookOpen, ArrowLeft, Plus } from 'lucide-react';
import { fetchDriveById } from '../../services/driveService';
import { fetchQueriesByDrive, createQuery } from '../../services/queryService';
import { fetchJourneysByDrive } from '../../services/journeyService';
import QueryCard from '../../components/QueryCard';
import JourneyCard from '../../components/JourneyCard';
import Textarea from '../../components/Textarea';
import Loader from '../../components/Loader';
import ErrorBanner from '../../components/ErrorBanner';

const DriveDetailPage = () => {
  const { driveId } = useParams();
  const [drive, setDrive] = useState(null);
  const [queries, setQueries] = useState([]);
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [queryContent, setQueryContent] = useState('');
  const [submittingQuery, setSubmittingQuery] = useState(false);

  useEffect(() => {
    const loadDriveDetails = async () => {
      try {
        const [driveData, queriesData, journeysData] = await Promise.all([
          fetchDriveById(driveId),
          fetchQueriesByDrive(driveId, true),
          fetchJourneysByDrive(driveId)
        ]);

        setDrive(driveData.drive);
        setQueries(queriesData.queries || []);
        setJourneys(journeysData.journeys || []);
      } catch (error) {
        setError('Failed to load drive details');
      } finally {
        setLoading(false);
      }
    };

    loadDriveDetails();
  }, [driveId]);

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    if (!queryContent.trim()) return;

    setSubmittingQuery(true);
    try {
      await createQuery(driveId, { content: queryContent });
      setQueryContent('');
      // Refresh queries
      const queriesData = await fetchQueriesByDrive(driveId, true);
      setQueries(queriesData.queries || []);
    } catch (error) {
      setError('Failed to submit query');
    } finally {
      setSubmittingQuery(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!drive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Drive not found</p>
          <Link to="/drives" className="text-primary-900 hover:text-primary-800 mt-2 inline-block">
            Back to Drives
          </Link>
        </div>
      </div>
    );
  }

  const isRegistrationOpen = new Date(drive.registration_deadline) > new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            to="/drives" 
            className="inline-flex items-center text-primary-900 hover:text-primary-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Drives
          </Link>
        </div>

        <ErrorBanner message={error} onClose={() => setError('')} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Company Details - Top Left */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-primary-100 p-3 rounded-xl">
                    <Building className="h-8 w-8 text-primary-900" />
                  </div>
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold text-gray-900">{drive.company?.name}</h1>
                    <p className="text-gray-600">Batch: {drive.batch}</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isRegistrationOpen 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isRegistrationOpen ? 'Registration Open' : 'Registration Closed'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Registration Deadline</p>
                    <p className="font-medium text-gray-900">{formatDate(drive.registration_deadline)}</p>
                  </div>
                </div>

                {drive.test_date && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Test Date</p>
                      <p className="font-medium text-gray-900">{formatDate(drive.test_date)}</p>
                    </div>
                  </div>
                )}

                {drive.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-900">{drive.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Mode</p>
                    <p className="font-medium text-gray-900">{drive.mode || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Queries Section - Bottom Left */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className=" p-2 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-blue-800" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Public Queries</h2>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {queries.length} queries
                </span>
              </div>

              {/* Query Form */}
              <form onSubmit={handleSubmitQuery} className="mb-6">
                <Textarea
                  label="Ask a Question"
                  name="content"
                  value={queryContent}
                  onChange={(e) => setQueryContent(e.target.value)}
                  placeholder="Have a question about this drive? Ask here and help other students too..."
                  rows={3}
                />
                <button
                  type="submit"
                  disabled={submittingQuery || !queryContent.trim()}
                  className="bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                >
                  {submittingQuery ? <Loader size="sm" /> : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Query
                    </>
                  )}
                </button>
              </form>

              {/* Queries List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {queries.length > 0 ? (
                  queries.map((query) => (
                    <QueryCard key={query.id} query={query} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No queries yet. Be the first to ask!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Journeys Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">

                <h2 className="text-xl font-semibold text-gray-900">Journey Experiences</h2>
              </div>
              <div className="flex items-center space-x-4">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {journeys.filter(j => j.approved).length} experiences
                </span>
                <Link
                  to={`/drives/${driveId}/journeys/new`}
                  className="bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors duration-200 flex items-center text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Share Journey
                </Link>
              </div>
            </div>

            <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {journeys.length > 0 ? (
                journeys.filter(journey => journey.approved).map((journey) => (
                  <JourneyCard key={journey.id} journey={journey} />
                ))
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No journey experiences shared yet</p>
                  <p className="text-gray-400 text-sm mb-4">
                    Be the first to share your interview experience and help other students!
                  </p>
                  <Link
                    to={`/drives/${driveId}/journeys/new`}
                    className="inline-flex items-center bg-primary-900 text-white px-6 py-3 rounded-lg hover:bg-primary-800 transition-colors duration-200"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Share Your Journey
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriveDetailPage;