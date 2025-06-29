import { AlertCircle, X } from 'lucide-react';

const ErrorBanner = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-red-800 text-sm">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-red-400 hover:text-red-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorBanner;