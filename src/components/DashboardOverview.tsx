import React, { useMemo } from 'react';
import { useSkillContext } from '../context/SkillContext';
import { BarChart3, BookOpen, Clock, Award, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, subDays, isAfter, parseISO } from 'date-fns';
import SkillCard from './SkillCard';
import RecentActivityList from './RecentActivityList';
import WeeklyProgressChart from './WeeklyProgressChart';

const DashboardOverview: React.FC = () => {
  const { skills } = useSkillContext();
  
  const totalLearningTime = useMemo(() => {
    return skills.reduce((total, skill) => total + skill.totalTime, 0);
  }, [skills]);
  
  const activeSkillsCount = useMemo(() => {
    return skills.filter(skill => skill.status === 'Learning').length;
  }, [skills]);
  
  const masteredSkillsCount = useMemo(() => {
    return skills.filter(skill => skill.status === 'Mastered').length;
  }, [skills]);
  
  const pinnedSkills = useMemo(() => {
    return skills.filter(skill => skill.pinned);
  }, [skills]);
  
  const recentSessions = useMemo(() => {
    const oneWeekAgo = subDays(new Date(), 7);
    
    const allSessions = skills.flatMap(skill => 
      skill.sessions.map(session => ({
        ...session,
        skillName: skill.name,
        skillId: skill.id,
      }))
    );
    
    return allSessions
      .filter(session => isAfter(parseISO(session.date), oneWeekAgo))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [skills]);
  
  const todayDateFormatted = format(new Date(), 'EEEE, MMMM do, yyyy');
  
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
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">{todayDateFormatted}</p>
        </div>
        <Link to="/skills/new" className="btn btn-primary flex items-center space-x-2">
          <PlusCircle size={18} />
          <span>Add Skill</span>
        </Link>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex items-center space-x-4">
          <div className="p-3 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Skills</p>
            <p className="text-2xl font-bold">{activeSkillsCount}</p>
          </div>
        </div>
        
        <div className="card flex items-center space-x-4">
          <div className="p-3 rounded-full bg-accent-100 text-accent-600 dark:bg-accent-900 dark:text-accent-400">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Learning Time</p>
            <p className="text-2xl font-bold">{formatTime(totalLearningTime)}</p>
          </div>
        </div>
        
        <div className="card flex items-center space-x-4">
          <div className="p-3 rounded-full bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-400">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mastered Skills</p>
            <p className="text-2xl font-bold">{masteredSkillsCount}</p>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pinned Skills */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pinned Skills</h2>
            <Link to="/skills" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              View All
            </Link>
          </div>
          
          {pinnedSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pinnedSkills.map(skill => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          ) : (
            <div className="card bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center p-8 text-center">
              <BookOpen className="text-gray-400 mb-2" size={32} />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No pinned skills</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Pin your most important skills to track them easily</p>
              <Link to="/skills" className="btn btn-outline">
                Manage Skills
              </Link>
            </div>
          )}
          
          {/* Weekly Progress */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Progress</h2>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <BarChart3 size={18} className="mr-1" />
                <span className="text-sm">Last 7 days</span>
              </div>
            </div>
            <WeeklyProgressChart />
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <RecentActivityList sessions={recentSessions} />
            
            {recentSessions.length === 0 && (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400">No recent activity found</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Start logging your learning sessions</p>
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/skills/new"
                className="flex items-center p-3 rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              >
                <PlusCircle className="text-primary-500 mr-3" size={20} />
                <span>Add a new skill</span>
              </Link>
              <Link
                to="/skills"
                className="flex items-center p-3 rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              >
                <BookOpen className="text-accent-500 mr-3" size={20} />
                <span>Manage your skills</span>
              </Link>
              <Link
                to="/analytics"
                className="flex items-center p-3 rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              >
                <BarChart3 className="text-secondary-500 mr-3" size={20} />
                <span>View analytics</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;