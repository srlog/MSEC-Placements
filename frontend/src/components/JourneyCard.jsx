import { User, Clock, CheckCircle, XCircle } from 'lucide-react';
import JourneyRoundsDisplay from './JourneyRoundsDisplay';

const JourneyCard = ({ journey, showActions = false, onApprove, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <User className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">{journey.student?.name || journey.author?.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            {formatDate(journey.created_at)}
          </div>
          {journey.approved ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
      </div>

      <div className="space-y-6">
        {journey.rounds_json && (
          <div>
            <JourneyRoundsDisplay roundsJson={journey.rounds_json} />
          </div>
        )}

        {journey.overall_experience && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Overall Experience</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{journey.overall_experience}</p>
            </div>
          </div>
        )}

        {journey.tips_for_juniors && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Tips for Juniors</h4>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-800 leading-relaxed">{journey.tips_for_juniors}</p>
            </div>
          </div>
        )}
      </div>

        <div className="flex gap-4">
               {showActions && !journey.approved && (
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => onApprove(journey)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Approve Journey
          </button>
        </div>
      )}

      {showActions && (
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => onDelete(journey)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Delete Journey
          </button>
        </div>
      )}
        </div>
   

      

      <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          journey.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {journey.approved ? 'Approved' : 'Pending Approval'}
        </span>
      </div>
    </div>
  );
};

export default JourneyCard;