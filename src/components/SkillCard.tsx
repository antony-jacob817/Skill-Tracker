import React from 'react';
import { Link } from 'react-router-dom';
import { Skill, SkillLevel, SkillStatus } from '../types';
import { Clock, Star, Pin, BarChart } from 'lucide-react';
import { useSkillContext } from '../context/SkillContext';

interface SkillCardProps {
  skill: Skill;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const { togglePinSkill } = useSkillContext();
  
  const getLevelColor = (level: SkillLevel) => {
    switch (level) {
      case SkillLevel.Beginner:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case SkillLevel.Intermediate:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case SkillLevel.Advanced:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const getStatusColor = (status: SkillStatus) => {
    switch (status) {
      case SkillStatus.NotStarted:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case SkillStatus.Learning:
        return 'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300';
      case SkillStatus.Mastered:
        return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${mins} min`;
    }
  };
  
  const handleTogglePin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    togglePinSkill(skill.id);
  };
  
  const recentSessions = skill.sessions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  return (
    <Link to={`/skills/${skill.id}`} className="card hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{skill.name}</h3>
        <button
          onClick={handleTogglePin}
          className={`p-1.5 rounded-full transition-colors ${
            skill.pinned
              ? 'text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300'
              : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
          }`}
          aria-label={skill.pinned ? 'Unpin skill' : 'Pin skill'}
        >
          <Pin size={16} className={skill.pinned ? 'fill-current' : ''} />
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs px-2.5 py-1 rounded-full ${getLevelColor(skill.level)}`}>
          {skill.level}
        </span>
        <span className={`text-xs px-2.5 py-1 rounded-full ${getStatusColor(skill.status)}`}>
          {skill.status}
        </span>
      </div>
      
      <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
        <Clock size={16} className="mr-1" />
        <span className="text-sm">{formatTime(skill.totalTime)}</span>
      </div>
      
      {/* Progress Section */}
      <div className="mt-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">Recent sessions</span>
          <span className="text-gray-700 dark:text-gray-300">{skill.sessions.length}</span>
        </div>
        {recentSessions.length > 0 ? (
          <div className="space-y-2">
            {recentSessions.map(session => (
              <div 
                key={session.id} 
                className="flex justify-between items-center text-xs py-1 px-2 bg-gray-50 dark:bg-gray-800/50 rounded"
              >
                <span>{new Date(session.date).toLocaleDateString()}</span>
                <span>{formatTime(session.duration)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No sessions recorded yet</p>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <div className="flex items-center text-sm text-primary-600 dark:text-primary-400">
          <BarChart size={14} className="mr-1" />
          <span>View Details</span>
        </div>
        
        <div className="flex items-center">
          {skill.tasks.length > 0 && (
            <div className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
              {skill.tasks.filter(task => task.completed).length}/{skill.tasks.length} tasks
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SkillCard;