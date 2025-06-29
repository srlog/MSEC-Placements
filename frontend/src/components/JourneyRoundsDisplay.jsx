import { CheckCircle, Clock, Users, Brain } from 'lucide-react';

const JourneyRoundsDisplay = ({ roundsJson }) => {
  let rounds = [];
  
  try {
    if (typeof roundsJson === 'string') {
      rounds = JSON.parse(roundsJson);
    } else if (Array.isArray(roundsJson)) {
      rounds = roundsJson;
    }
  } catch (error) {
    // If parsing fails, treat as plain text
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Interview Process</h4>
        <p className="text-gray-700 whitespace-pre-wrap">{roundsJson}</p>
      </div>
    );
  }

  if (!Array.isArray(rounds) || rounds.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-500">No interview rounds information available</p>
      </div>
    );
  }

  const getRoundIcon = (roundName) => {
    const name = roundName.toLowerCase();
    if (name.includes('online') || name.includes('assessment') || name.includes('test')) {
      return <Clock className="h-5 w-5 text-blue-600" />;
    } else if (name.includes('technical') || name.includes('coding')) {
      return <Brain className="h-5 w-5 text-purple-600" />;
    } else if (name.includes('hr') || name.includes('behavioral')) {
      return <Users className="h-5 w-5 text-green-600" />;
    } else {
      return <CheckCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRoundColor = (roundName) => {
    const name = roundName.toLowerCase();
    if (name.includes('online') || name.includes('assessment') || name.includes('test')) {
      return 'border-blue-200 bg-blue-50';
    } else if (name.includes('technical') || name.includes('coding')) {
      return 'border-purple-200 bg-purple-50';
    } else if (name.includes('hr') || name.includes('behavioral')) {
      return 'border-green-200 bg-green-50';
    } else {
      return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 mb-4 flex items-center">
        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
        Interview Process ({rounds.length} rounds)
      </h4>
      
      <div className="space-y-3">
        {rounds.map((round, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${getRoundColor(round.round)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getRoundIcon(round.round)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                    Round {index + 1}
                  </span>
                  <h5 className="font-medium text-gray-900">{round.round}</h5>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{round.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JourneyRoundsDisplay;