import React from 'react';
import { ExternalLink, BookOpen, Video, FileText } from 'lucide-react';
import { useSkillContext } from '../context/SkillContext';

interface ContentSuggestionsProps {
  skillId: string;
}

const ContentSuggestions: React.FC<ContentSuggestionsProps> = ({ skillId }) => {
  const { suggestions } = useSkillContext();
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={16} />;
      case 'article':
        return <FileText size={16} />;
      case 'course':
        return <BookOpen size={16} />;
      default:
        return <ExternalLink size={16} />;
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
  
  if (suggestions.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 dark:text-gray-400">No suggestions available</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {suggestions.map(suggestion => (
        <a
          key={suggestion.id}
          href={suggestion.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/70 transition-colors"
        >
          <div className="flex items-start space-x-3">
            <div className={`
              p-2 rounded-full flex-shrink-0
              ${suggestion.type === 'video' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : ''}
              ${suggestion.type === 'article' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : ''}
              ${suggestion.type === 'course' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : ''}
            `}>
              {getIcon(suggestion.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{suggestion.title}</h4>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                  {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTime(suggestion.duration)}
                </span>
              </div>
            </div>
            <ExternalLink size={14} className="text-gray-400 flex-shrink-0" />
          </div>
        </a>
      ))}
    </div>
  );
};

export default ContentSuggestions;