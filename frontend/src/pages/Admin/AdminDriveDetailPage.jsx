import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Building, Users, MessageCircle, BookOpen, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { fetchDriveById } from '../../services/driveService';
import { fetchQueriesByDrive, updateQuery } from '../../services/queryService';
import { fetchAllJourneysByDrive, updateJourney,deleteJourney } from '../../services/journeyService';
import QueryCard from '../../components/QueryCard';
import JourneyCard from '../../components/JourneyCard';
import Textarea from '../../components/Textarea';
import Loader from '../../components/Loader';
import ErrorBanner from '../../components/ErrorBanner';

const AdminDriveDetailPage = () => {
  const { driveId } = useParams();
  const [drive, setDrive] = useState(null);
  const [queries, setQueries] = useState([]);
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadDriveDetails = async () => {
      try {
        const [driveData, queriesData, journeysData] = await Promise.all([
          fetchDriveById(driveId),
          fetchQueriesByDrive(driveId, false), // Get all queries for admin
          fetchAllJourneysByDrive(driveId)
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

  const handleAnswerQuery = (query) => {
    setSelectedQuery(query);
    setAnswerText(query.answer || '');
    setIsPublic(query.public !== undefined ? query.public : true);
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    setSubmitting(true);
    try {
      await updateQuery(selectedQuery.id, {
        answer: answerText,
        public: isPublic
      });

      // Update local state
      setQueries(queries.map(query => 
        query.id === selectedQuery.id 
          ? { ...query, answer: answerText, public: isPublic }
          : query
      ));

      setSelectedQuery(null);
      setAnswerText('');
    } catch (error) {
      setError('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleQueryVisibility = async (queryId, currentPublic) => {
    try {
      await updateQuery(queryId, { public: !currentPublic });
      setQueries(queries.map(query => 
        query.id === queryId 
          ? { ...query, public: !currentPublic }
          : query
      ));
    } catch (error) {
      setError('Failed to update query visibility');
    }
  };

  const handleApproveJourney = async (journey) => {
    try {
      await updateJourney(journey.id, { approved: true });
      
      // Update local state
      setJourneys(journeys.map(j => 
        j.id === journey.id 
          ? { ...j, approved: true }
          : j
      ));
    } catch (error) {
      setError('Failed to approve journey');
    }
  };
   const handleDeleteJourney = async (journey) => {
    try {
      await deleteJourney(journey.id);
      

    // remove it from local state
    setJourneys(journeys.filter(j => j.id !== journey.id));
    } catch (error) {
      setError('Failed to Delete journey');
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
          <Link to="/admin/drives" className="text-primary-900 hover:text-primary-800 mt-2 inline-block">
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
            to="/admin/drives" 
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
            {/* Company Details */}
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

            {/* Queries Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
 
                  <h2 className="text-xl font-semibold text-gray-900">Queries Management</h2>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {queries.length} queries
                </span>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {queries.length > 0 ? (
                  queries.map((query) => (
                    <div key={query.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Student: <span className="font-medium">{query.author?.name}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(query.created_at).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleQueryVisibility(query.id, query.public)}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              query.public 
                                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title={query.public ? 'Make Private' : 'Make Public'}
                          >
                            {query.public ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            query.public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {query.public ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-800 mb-3">{query.content}</p>

                      {query.answer && (
                        <div className="bg-blue-50 rounded-lg p-3 mb-3">
                          <p className="text-blue-800 text-sm">{query.answer}</p>
                        </div>
                      )}

                      {!query.answer && (
                        <button
                          onClick={() => handleAnswerQuery(query)}
                          className="bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors duration-200 text-sm"
                        >
                          Answer Query
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No queries yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Journeys */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">

                <h2 className="text-xl font-semibold text-gray-900">Journey Management</h2>
              </div>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {journeys.length} journeys
              </span>
            </div>

            <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
              {journeys.length > 0 ? (
                journeys.map((journey) => (
                  <JourneyCard
                    key={journey.id}
                    journey={journey}
                    showActions={true}
                    onApprove={handleApproveJourney}
                    onDelete={handleDeleteJourney}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No journey experiences yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Answer Modal */}
        {selectedQuery && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Answer Query</h2>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Student: {selectedQuery.author?.name}</p>
                  <p className="text-gray-800">{selectedQuery.content}</p>
                </div>

                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  <Textarea
                    label="Your Answer"
                    name="answer"
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Provide a helpful answer to the student's query..."
                    rows={6}
                    required
                  />

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="isPublic" className="text-sm text-gray-700">
                      Make this answer public for all students to see
                    </label>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setSelectedQuery(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {submitting ? <Loader size="sm" /> : 'Submit Answer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDriveDetailPage;