import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, Clock, Calendar, Edit2, Trash2, PlusCircle, 
  Pin, CheckCircle, XCircle, BarChart3, BookOpen, AlertCircle 
} from 'lucide-react';
import Layout from '../components/Layout';
import { useSkillContext } from '../context/SkillContext';
import { format } from 'date-fns';
import SessionForm from '../components/SessionForm';
import TaskList from '../components/TaskList';
import ContentSuggestions from '../components/ContentSuggestions';

const SkillDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { skills, deleteSkill, togglePinSkill, fetchContentSuggestions } = useSkillContext();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const skill = useMemo(() => {
    return skills.find(s => s.id === id);
  }, [id, skills]);
  
  const handleDelete = () => {
    if (id) {
      deleteSkill(id);
      navigate('/skills');
    }
  };
  
  const handleTogglePin = () => {
    if (id) {
      togglePinSkill(id);
    }
  };
  
  const sortedSessions = useMemo(() => {
    if (!skill) return [];
    return [...skill.sessions].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [skill]);
  
  const handleGetSuggestions = async () => {
    if (skill) {
      await fetchContentSuggestions(skill.name, skill.level);
      setShowSuggestions(true);
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
  
  if (!skill) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle size={48} className="text-error-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Skill Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The skill you're looking for doesn't exist or has been deleted.</p>
          <Link to="/skills" className="btn btn-primary">
            Back to Skills
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="mb-2">
              <button
                onClick={() => navigate('/skills')}
                className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <ChevronLeft size={18} />
                <span>Back to Skills</span>
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{skill.name}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-sm px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {skill.level}
              </span>
              <span className="text-sm px-2.5 py-1 rounded-full bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300">
                {skill.status}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleTogglePin}
              className={`btn ${
                skill.pinned ? 'btn-primary' : 'btn-outline'
              } flex items-center space-x-2`}
            >
              <Pin size={18} className={skill.pinned ? 'fill-white' : ''} />
              <span>{skill.pinned ? 'Pinned' : 'Pin Skill'}</span>
            </button>
            
            <Link
              to={`/skills/${skill.id}/edit`}
              className="btn btn-outline flex items-center space-x-2"
            >
              <Edit2 size={18} />
              <span>Edit</span>
            </Link>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-outline text-error-600 border-error-600 hover:bg-error-50 dark:text-error-400 dark:border-error-400 dark:hover:bg-error-900/20 flex items-center space-x-2"
            >
              <Trash2 size={18} />
              <span>Delete</span>
            </button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card flex items-center space-x-4">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Learning Time</p>
              <p className="text-2xl font-bold">{formatTime(skill.totalTime)}</p>
            </div>
          </div>
          
          <div className="card flex items-center space-x-4">
            <div className="p-3 rounded-full bg-accent-100 text-accent-600 dark:bg-accent-900 dark:text-accent-400">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Learning Sessions</p>
              <p className="text-2xl font-bold">{skill.sessions.length}</p>
            </div>
          </div>
          
          <div className="card flex items-center space-x-4">
            <div className="p-3 rounded-full bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-400">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Tasks</p>
              <p className="text-2xl font-bold">
                {skill.tasks.filter(task => task.completed).length}/{skill.tasks.length}
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sessions Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Learning Sessions</h2>
                <button
                  onClick={() => setShowSessionForm(true)}
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <PlusCircle size={18} />
                  <span>Log Session</span>
                </button>
              </div>
              
              {sortedSessions.length > 0 ? (
                <div className="space-y-4">
                  {sortedSessions.map(session => (
                    <div key={session.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {format(new Date(session.date), 'MMMM d, yyyy')}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(session.date), 'h:mm a')}
                          </p>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock size={14} className="mr-1" />
                          <span>{formatTime(session.duration)}</span>
                        </div>
                      </div>
                      {session.notes && (
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{session.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <Calendar className="mx-auto text-gray-400 mb-2" size={32} />
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">No sessions yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Log your learning sessions to track progress</p>
                  <button
                    onClick={() => setShowSessionForm(true)}
                    className="btn btn-primary"
                  >
                    Log Your First Session
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Tasks Section */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tasks</h2>
              </div>
              <TaskList skillId={skill.id} tasks={skill.tasks} />
            </div>
            
            {/* Content Suggestions */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Learning Resources</h2>
              </div>
              
              {!showSuggestions ? (
                <div className="text-center py-6">
                  <BookOpen className="mx-auto text-gray-400 mb-2" size={32} />
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">Find Learning Resources</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Get personalized content suggestions for this skill</p>
                  <button
                    onClick={handleGetSuggestions}
                    className="btn btn-outline"
                  >
                    Get Suggestions
                  </button>
                </div>
              ) : (
                <ContentSuggestions skillId={skill.id} />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl animate-fade-in">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400 mb-4">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Skill</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to delete "{skill.name}"? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn bg-error-500 text-white hover:bg-error-600 focus:ring-error-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Session Form Modal */}
      {showSessionForm && (
        <SessionForm
          skillId={skill.id}
          onClose={() => setShowSessionForm(false)}
        />
      )}
    </Layout>
  );
};

export default SkillDetailPage;