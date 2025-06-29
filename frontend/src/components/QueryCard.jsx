import { MessageCircle, User, Clock } from 'lucide-react';

const QueryCard = ({ query, showActions = false, onAnswer }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <User className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">{query.student?.name || 'Anonymous'}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          {formatDate(query.created_at)}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-800">{query.content}</p>
      </div>

      {query.answer && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <MessageCircle className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">Admin Response</span>
          </div>
          <p className="text-blue-700">{query.answer}</p>
        </div>
      )}

      {showActions && !query.answer && (
        <div className="flex justify-end">
          <button
            onClick={() => onAnswer(query)}
            className="bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors duration-200"
          >
            Answer Query
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          query.public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {query.public ? 'Public' : 'Private'}
        </span>
        {query.answer && (
          <span className="text-xs text-green-600">Answered</span>
        )}
      </div>
    </div>
  );
};

export default QueryCard;