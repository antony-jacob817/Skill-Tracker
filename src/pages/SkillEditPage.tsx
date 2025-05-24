import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import Layout from '../components/Layout';
import { useSkillContext } from '../context/SkillContext';
import { SkillLevel, SkillStatus } from '../types';

const SkillEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { skills, updateSkill } = useSkillContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    level: SkillLevel.Beginner,
    status: SkillStatus.NotStarted,
  });
  
  const [errors, setErrors] = useState({
    name: '',
  });
  
  useEffect(() => {
    const skill = skills.find(s => s.id === id);
    if (skill) {
      setFormData({
        name: skill.name,
        level: skill.level,
        status: skill.status,
      });
    } else {
      navigate('/skills');
    }
  }, [id, skills, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (name === 'name' && errors.name) {
      setErrors(prev => ({
        ...prev,
        name: '',
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
    };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Skill name is required';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) {
      return;
    }
    
    const skill = skills.find(s => s.id === id);
    if (skill) {
      updateSkill({
        ...skill,
        name: formData.name,
        level: formData.level,
        status: formData.status,
      });
      navigate(`/skills/${id}`);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/skills/${id}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
            <span>Back to Skill</span>
          </button>
        </div>
        
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Skill</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Skill Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input ${errors.name ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                placeholder="e.g., JavaScript, Photography, Spanish"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error-500">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Skill Level
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="select"
              >
                {Object.values(SkillLevel).map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select"
              >
                {Object.values(SkillStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button type="submit" className="btn btn-primary flex items-center space-x-2">
                <Save size={18} />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SkillEditPage;