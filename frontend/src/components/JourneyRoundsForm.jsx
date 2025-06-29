import { useState } from 'react';
import { Plus, X, Edit2 } from 'lucide-react';
import FormInput from './FormInput';
import Textarea from './Textarea';

const JourneyRoundsForm = ({ rounds, onChange }) => {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newRound, setNewRound] = useState({
    round: '',
    description: ''
  });

  const handleAddRound = () => {
    if (newRound.round.trim() && newRound.description.trim()) {
      const updatedRounds = [...rounds, { ...newRound }];
      onChange(updatedRounds);
      setNewRound({ round: '', description: '' });
    }
  };

  const handleEditRound = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index, updatedRound) => {
    const updatedRounds = rounds.map((round, i) => 
      i === index ? updatedRound : round
    );
    onChange(updatedRounds);
    setEditingIndex(-1);
  };

  const handleRemoveRound = (index) => {
    const updatedRounds = rounds.filter((_, i) => i !== index);
    onChange(updatedRounds);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Interview Rounds</h3>
        <p className="text-sm text-blue-700">
          Add each round of the interview process separately. This helps other students understand the complete process.
        </p>
      </div>

      {/* Existing Rounds */}
      <div className="space-y-4">
        {rounds.map((round, index) => (
          <RoundCard
            key={index}
            round={round}
            index={index}
            isEditing={editingIndex === index}
            onEdit={() => handleEditRound(index)}
            onSave={(updatedRound) => handleSaveEdit(index, updatedRound)}
            onRemove={() => handleRemoveRound(index)}
            onCancelEdit={() => setEditingIndex(-1)}
          />
        ))}
      </div>

      {/* Add New Round */}
      <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
        <h4 className="font-medium text-gray-900 mb-4">Add New Round</h4>
        <div className="space-y-4">
          <FormInput
            label="Round Name"
            name="round"
            value={newRound.round}
            onChange={(e) => setNewRound({ ...newRound, round: e.target.value })}
            placeholder="e.g., Online Assessment, Technical Interview, HR Interview"
          />
          <Textarea
            label="Description"
            name="description"
            value={newRound.description}
            onChange={(e) => setNewRound({ ...newRound, description: e.target.value })}
            placeholder="Describe what happened in this round, questions asked, difficulty level, etc."
            rows={3}
          />
          <button
            type="button"
            onClick={handleAddRound}
            disabled={!newRound.round.trim() || !newRound.description.trim()}
            className="bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Round
          </button>
        </div>
      </div>
    </div>
  );
};

const RoundCard = ({ round, index, isEditing, onEdit, onSave, onRemove, onCancelEdit }) => {
  const [editData, setEditData] = useState(round);

  const handleSave = () => {
    if (editData.round.trim() && editData.description.trim()) {
      onSave(editData);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white border-2 border-primary-200 rounded-lg p-4">
        <div className="space-y-4">
          <FormInput
            label="Round Name"
            name="round"
            value={editData.round}
            onChange={(e) => setEditData({ ...editData, round: e.target.value })}
          />
          <Textarea
            label="Description"
            name="description"
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            rows={3}
          />
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleSave}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors duration-200"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
              Round {index + 1}
            </span>
            <h4 className="font-medium text-gray-900">{round.round}</h4>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{round.description}</p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            type="button"
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Edit Round"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 hover:text-red-800 p-1"
            title="Remove Round"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JourneyRoundsForm;