import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useSkillContext } from '../context/SkillContext';

interface SessionFormProps {
  skillId: string;
  onClose: () => void;
}

const SessionForm: React.FC<SessionFormProps> = ({ skillId, onClose }) => {
  const { addSession } = useSkillContext();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16), // Format: 2023-04-20T15:30
    duration: 30,
    notes: '',
  });
  
  const [errors, setErrors] = useState({
    date: '',
    duration: '',
  });
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear errors when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors = {
      date: '',
      duration: '',
    };
    
    if (!formData.date) {
      newErrors.date = 'Date and time are required';
    }
    
    const durationValue = Number(formData.duration);
    if (isNaN(durationValue) || durationValue <= 0) {
      newErrors.duration = 'Duration must be a positive number';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Convert date string to ISO string
    const dateObj = new Date(formData.date);
    
    addSession(skillId, {
      date: dateObj.toISOString(),
      duration: Number(formData.duration),
      notes: formData.notes,
    });
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Log Learning Session</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date and Time *
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`input ${errors.date ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-error-500">{errors.date}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duration (minutes) *
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              className={`input ${errors.duration ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
            />
            {errors.duration && (
              <p className="mt-1 text-sm text-error-500">{errors.duration}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="textarea"
              placeholder="What did you learn? Any challenges or breakthroughs?"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center space-x-2"
            >
              <Save size={18} />
              <span>Save Session</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionForm;