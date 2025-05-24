import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface EnhancedSession {
  id: string;
  date: string;
  duration: number;
  notes: string;
  skillId: string;
  skillName: string;
}

interface RecentActivityListProps {
  sessions: EnhancedSession[];
}

const RecentActivityList: React.FC<RecentActivityListProps> = ({ sessions }) => {
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  if (sessions.length === 0) {
    return null;
  }
  
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {sessions.map(session => (
        <Link
          key={session.id}
          to={`/skills/${session.skillId}`}
          className="block py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-6 px-6 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">{session.skillName}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(session.date)}</p>
            </div>
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <Clock size={12} className="mr-1" />
              <span>{formatTime(session.duration)}</span>
            </div>
          </div>
          {session.notes && (
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{session.notes}</p>
          )}
        </Link>
      ))}
    </div>
  );
};

export default RecentActivityList;