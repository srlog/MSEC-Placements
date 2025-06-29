import { useState, useEffect } from 'react';
import { MessageCircle, Search } from 'lucide-react';
import { fetchUnansweredQueries, updateQuery } from '../../services/queryService';
import FormInput from '../../components/FormInput';
import Textarea from '../../components/Textarea';
import Loader from '../../components/Loader';
import ErrorBanner from '../../components/ErrorBanner';

const UnansweredQueriesPage = () => {
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadQueries = async () => {
      try {
        const data = await fetchUnansweredQueries();
        setQueries(data.queries || []);
        setFilteredQueries(data.queries || []);
      } catch (error) {
        setError('Failed to load unanswered queries');
      } finally {
        setLoading(false);
      }
    };

    loadQueries();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = queries.filter(query =>
        query.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.author?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQueries(filtered);
    } else {
      setFilteredQueries(queries);
    }
  }, [queries, searchTerm]);

  const handleAnswerQuery = (query) => {
    setSelectedQuery(query);
    setAnswerText('');
    setIsPublic(true);
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
      setQueries(queries.filter(query => query.id !== selectedQuery.id));
      setSelectedQuery(null);
      setAnswerText('');
    } catch (error) {
      setError('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Unanswered Queries</h1>
          <p className="text-gray-600 mt-2">Review and respond to pending student queries</p>
        </div>

        <ErrorBanner message={error} onClose={() => setError('')} />

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="relative max-w-md">
            <FormInput
              placeholder="Search queries or students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Queries List */}
        <div className="space-y-6">
          {filteredQueries.length > 0 ? (
            filteredQueries.map((query) => (
              <div key={query.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Student: <span className="font-medium">{query.author?.name}</span>
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(query.created_at)}</p>
                  </div>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                    Pending Answer
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-gray-800 leading-relaxed">{query.content}</p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleAnswerQuery(query)}
                    className="bg-primary-900 text-white px-6 py-2 rounded-lg hover:bg-primary-800 transition-colors duration-200"
                  >
                    Answer Query
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No unanswered queries found</p>
              <p className="text-gray-400 mt-2">
                {searchTerm ? 'Try adjusting your search criteria' : 'All queries have been answered'}
              </p>
            </div>
          )}
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

export default UnansweredQueriesPage;