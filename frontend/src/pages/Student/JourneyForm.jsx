import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { createJourney } from '../../services/journeyService';
import JourneyRoundsForm from '../../components/JourneyRoundsForm';
import Textarea from '../../components/Textarea';
import ErrorBanner from '../../components/ErrorBanner';
import Loader from '../../components/Loader';

const JourneyForm = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rounds: [],
    overall_experience: '',
    tips_for_juniors: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoundsChange = (rounds) => {
    setFormData({
      ...formData,
      rounds
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rounds.length === 0) {
      setError('Please add at least one interview round');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convert rounds array to JSON string for backend
      const journeyData = {
        rounds_json: JSON.stringify(formData.rounds),
        overall_experience: formData.overall_experience,
        tips_for_juniors: formData.tips_for_juniors
      };

      await createJourney(driveId, journeyData);
      navigate(`/drives/${driveId}`, { 
        state: { message: 'Journey submitted successfully! It will be visible after admin approval.' }
      });
    } catch (error) {
      setError('Failed to submit journey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button 
              onClick={() => navigate(`/drives/${driveId}`)} 
              className="inline-flex items-center text-primary-900 hover:text-primary-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Drive Details
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Share Your Journey</h1>
            <p className="text-gray-600 mt-2">Help future candidates by sharing your detailed interview experience</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <ErrorBanner message={error} onClose={() => setError('')} />

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Interview Rounds */}
              <div>
                <JourneyRoundsForm
                  rounds={formData.rounds}
                  onChange={handleRoundsChange}
                />
              </div>

              {/* Overall Experience */}
              <div>
                <Textarea
                  label="Overall Experience"
                  name="overall_experience"
                  value={formData.overall_experience}
                  onChange={handleChange}
                  placeholder="Share your overall experience - how was the atmosphere, difficulty level, company culture, interviewer behavior, etc..."
                  rows={5}
                  required
                />
              </div>

              {/* Tips for Juniors */}
              <div>
                <Textarea
                  label="Tips for Juniors"
                  name="tips_for_juniors"
                  value={formData.tips_for_juniors}
                  onChange={handleChange}
                  placeholder="What advice would you give to students preparing for this company? Any specific preparation tips, resources, or strategies?"
                  rows={5}
                  required
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> Your journey will be reviewed by administrators before being made public. 
                  Please ensure your content is helpful, accurate, and appropriate for other students.
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(`/drives/${driveId}`)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || formData.rounds.length === 0}
                  className="bg-primary-900 text-white px-6 py-2 rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                >
                  {loading ? (
                    <Loader size="sm" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Journey
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyForm;