import { Calendar, MapPin, Building, Users, Edit, Trash2 } from 'lucide-react';

const DriveCard = ({ drive, onClick, showActions = false, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isRegistrationOpen = new Date(drive.registration_deadline) > new Date();

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-primary-200 transform hover:scale-105 relative group">
      {/* Action Buttons for Admin */}
      {showActions && (
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(drive.id);
            }}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg"
            title="Edit Drive"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(drive.id);
            }}
            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-lg"
            title="Delete Drive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      <div onClick={() => onClick(drive.id)} className="h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-xl">
              <Building className="h-8 w-8 text-primary-900" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">{drive.company?.name}</h3>
              <p className="text-sm text-gray-600">Batch: {drive.batch}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            isRegistrationOpen 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isRegistrationOpen ? 'Open' : 'Closed'}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            <span>Registration ends: {formatDate(drive.registration_deadline)}</span>
          </div>
          
          {drive.test_date && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-purple-500" />
              <span>Test Date: {formatDate(drive.test_date)}</span>
            </div>
          )}
          
          {drive.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-green-500" />
              <span>{drive.location}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 text-orange-500" />
            <span>Mode: {drive.mode || 'Not specified'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriveCard;