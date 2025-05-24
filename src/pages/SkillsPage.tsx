import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Bookmark, XCircle, Clock, Filter } from 'lucide-react';
import Layout from '../components/Layout';
import SkillCard from '../components/SkillCard';
import { useSkillContext } from '../context/SkillContext';
import { SkillStatus, SkillLevel } from '../types';

const SkillsPage: React.FC = () => {
  const { skills } = useSkillContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredSkills = skills.filter(skill => {
    // Apply search filter
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || skill.status === statusFilter;
    
    // Apply level filter
    const matchesLevel = levelFilter === 'all' || skill.level === levelFilter;
    
    return matchesSearch && matchesStatus && matchesLevel;
  });
  
  // Sort skills: pinned first, then by name
  const sortedSkills = [...filteredSkills].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return a.name.localeCompare(b.name);
  });
  
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setLevelFilter('all');
  };
  
  const areFiltersActive = searchQuery !== '' || statusFilter !== 'all' || levelFilter !== 'all';
  
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Skills</h1>
          <Link to="/skills/new" className="btn btn-primary flex items-center space-x-2">
            <PlusCircle size={18} />
            <span>Add Skill</span>
          </Link>
        </div>
        
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchQuery('')}
                >
                  <XCircle size={18} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline flex items-center space-x-2 md:w-auto"
            >
              <Filter size={18} />
              <span>Filters</span>
              {areFiltersActive && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 rounded-full">
                  Active
                </span>
              )}
            </button>
          </div>
          
          {/* Filter Options */}
          {showFilters && (
            <div className="card bg-gray-50 dark:bg-gray-800/50 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    id="status-filter"
                    className="select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    {Object.values(SkillStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="level-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Level
                  </label>
                  <select
                    id="level-filter"
                    className="select"
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                  >
                    <option value="all">All Levels</option>
                    {Object.values(SkillLevel).map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="btn btn-outline w-full"
                    disabled={!areFiltersActive}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Skills Grid */}
        {sortedSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSkills.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="card bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center p-12 text-center">
            {areFiltersActive ? (
              <>
                <Search className="text-gray-400 mb-2" size={32} />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No matching skills found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="btn btn-outline">
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <Bookmark className="text-gray-400 mb-2" size={32} />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No skills yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Start tracking your learning journey by adding a skill</p>
                <Link to="/skills/new" className="btn btn-primary">
                  Add Your First Skill
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SkillsPage;