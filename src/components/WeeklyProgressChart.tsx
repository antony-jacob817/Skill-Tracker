import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useSkillContext } from '../context/SkillContext';
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';

const WeeklyProgressChart: React.FC = () => {
  const { skills } = useSkillContext();
  
  const weeklyData = useMemo(() => {
    // Create an array of the past 7 days
    const today = new Date();
    const last7Days = eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    });
    
    // Initialize data for each day with 0 minutes
    const dailyData = last7Days.map(day => ({
      date: format(day, 'yyyy-MM-dd'),
      displayDate: format(day, 'EEE'),
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
  }, [skills]);
  
  // Find max value for better chart scaling
  const maxMinutes = Math.max(...weeklyData.map(day => day.minutes), 60);
  
  const formatYAxis = (minutes: number) => {
    if (minutes === 0) return '0';
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h`;
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
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
          <p className="font-medium">{label}</p>
          <p className="text-primary-500">{timeDisplay}</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <XAxis 
            dataKey="displayDate" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={formatYAxis}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            width={35}
            domain={[0, Math.ceil(maxMinutes / 60) * 60]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="minutes" 
            name="Learning Time" 
            fill="#4361EE" 
            radius={[4, 4, 0, 0]}
            barSize={36}
            animationDuration={500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyProgressChart;