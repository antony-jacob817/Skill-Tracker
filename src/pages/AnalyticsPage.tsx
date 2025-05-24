import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Layout from '../components/Layout';
import { useSkillContext } from '../context/SkillContext';
import { BarChart2, PieChart as PieChartIcon, Calendar, Clock } from 'lucide-react';
import { format, subDays, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { TimeDistribution } from '../types';

const AnalyticsPage: React.FC = () => {
  const { skills } = useSkillContext();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  
  // Colors for pie chart
  const COLORS = ['#4361EE', '#7209B7', '#4CC9F0', '#38B000', '#FFBE0B', '#EF233C', '#3A86FF', '#FB8500'];
  
  const getDaysInRange = () => {
    const today = new Date();
    
    switch (timeRange) {
      case 'week':
        return 7;
      case 'month':
        return 30;
      default:
        return 90; // Show up to 90 days for "all" view
    }
  };
  
  // Daily learning time data
  const dailyData = useMemo(() => {
    const daysToShow = getDaysInRange();
    const today = new Date();
    const pastDays = eachDayOfInterval({
      start: subDays(today, daysToShow - 1),
      end: today,
    });
    
    // Initialize data for each day with 0 minutes
    const dailyData = pastDays.map(day => ({
      date: format(day, 'yyyy-MM-dd'),
      displayDate: format(day, timeRange === 'week' ? 'EEE' : 'MMM d'),
      minutes: 0,
    }));
    
    // Collect all sessions
    const allSessions = skills.flatMap(skill => skill.sessions);
    
    // Add minutes to each day based on sessions
    allSessions.forEach(session => {
      const sessionDate = format(new Date(session.date), 'yyyy-MM-dd');
      const dayData = dailyData.find(day => day.date === sessionDate);
      
      if (dayData) {
        dayData.minutes += session.duration;
      }
    });
    
    return dailyData;
  }, [skills, timeRange]);
  
  // Time distribution per skill
  const timeDistributionData: TimeDistribution[] = useMemo(() => {
    // Filter sessions based on time range
    const startDate = subDays(new Date(), getDaysInRange() - 1);
    
    const filteredSkills = skills.map(skill => {
      // Filter sessions within the time range
      const filteredSessions = skill.sessions.filter(session => {
        const sessionDate = parseISO(session.date);
        return sessionDate >= startDate;
      });
      
      // Calculate total time for filtered sessions
      const totalTime = filteredSessions.reduce((sum, session) => sum + session.duration, 0);
      
      return {
        id: skill.id,
        name: skill.name,
        totalTime,
      };
    });
    
    // Sort by total time and filter out skills with no time
    return filteredSkills
      .filter(skill => skill.totalTime > 0)
      .sort((a, b) => b.totalTime - a.totalTime)
      .map((skill, index) => ({
        skillId: skill.id,
        skillName: skill.name,
        value: skill.totalTime,
        color: COLORS[index % COLORS.length],
      }));
  }, [skills, timeRange]);
  
  // Most focused skill
  const mostFocusedSkill = useMemo(() => {
    if (timeDistributionData.length === 0) return null;
    return timeDistributionData[0];
  }, [timeDistributionData]);
  
  // Total learning time in the selected period
  const totalLearningTime = useMemo(() => {
    return timeDistributionData.reduce((sum, item) => sum + item.value, 0);
  }, [timeDistributionData]);
  
  // Format time helper
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
  
  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const minutes = payload[0].value;
      const hours = Math.floor(minutes / 60);
      const remainingMins = minutes % 60;
      
      let timeDisplay;
      if (hours === 0) {
        timeDisplay = `${minutes} minutes`;
      } else if (remainingMins === 0) {
        timeDisplay = `${hours} hour${hours > 1 ? 's' : ''}`;
      } else {
        timeDisplay = `${hours}h ${remainingMins}m`;
      }
      
      return (
        <div className="bg-white dark:bg-gray-800 p-2 shadow rounded border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{format(new Date(label), 'MMMM d, yyyy')}</p>
          <p className="text-primary-500">{timeDisplay}</p>
        </div>
      );
    }
    
    return null;
  };
  
  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white dark:bg-gray-800 p-2 shadow rounded border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{data.skillName}</p>
          <p className="text-primary-500">{formatTime(data.value)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {Math.round((data.value / totalLearningTime) * 100)}% of total time
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                timeRange === 'week'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                timeRange === 'month'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                timeRange === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              All Time
            </button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card flex items-center space-x-4">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Learning Time ({timeRange === 'week' ? 'This Week' : timeRange === 'month' ? 'This Month' : 'All Time'})
              </p>
              <p className="text-2xl font-bold">{formatTime(totalLearningTime)}</p>
            </div>
          </div>
          
          {mostFocusedSkill && (
            <div className="card flex items-center space-x-4">
              <div className="p-3 rounded-full bg-accent-100 text-accent-600 dark:bg-accent-900 dark:text-accent-400">
                <BarChart2 size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Most Focused Skill ({timeRange === 'week' ? 'This Week' : timeRange === 'month' ? 'This Month' : 'All Time'})
                </p>
                <p className="text-2xl font-bold">{mostFocusedSkill.skillName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatTime(mostFocusedSkill.value)}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Learning Time */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Daily Learning Time</h2>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Calendar size={18} className="mr-1" />
                <span className="text-sm">
                  {timeRange === 'week' ? 'Last 7 days' : timeRange === 'month' ? 'Last 30 days' : 'All time'}
                </span>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <XAxis 
                    dataKey="displayDate" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => value === 0 ? '0' : value < 60 ? `${value}m` : `${Math.floor(value / 60)}h`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    width={35}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar 
                    dataKey="minutes" 
                    name="Learning Time" 
                    fill="#4361EE" 
                    radius={[4, 4, 0, 0]}
                    barSize={timeRange === 'week' ? 36 : 16}
                    animationDuration={500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Time Distribution */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Time Distribution</h2>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <PieChartIcon size={18} className="mr-1" />
                <span className="text-sm">By skill</span>
              </div>
            </div>
            
            {timeDistributionData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={timeDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      innerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                      animationDuration={500}
                    >
                      {timeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-center">
                <PieChartIcon size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No learning sessions recorded in this period</p>
              </div>
            )}
            
            {/* Legend */}
            {timeDistributionData.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                {timeDistributionData.map((item, index) => (
                  <div key={item.skillId} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{item.skillName}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">{formatTime(item.value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;