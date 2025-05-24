import React, { useState } from 'react';
import { CheckCircle, Circle, Trash2, PlusCircle } from 'lucide-react';
import { useSkillContext } from '../context/SkillContext';
import { Task } from '../types';

interface TaskListProps {
  skillId: string;
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ skillId, tasks }) => {
  const { addTask, updateTask, deleteTask } = useSkillContext();
  const [newTaskText, setNewTaskText] = useState('');
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newTaskText.trim()) {
      addTask(skillId, newTaskText.trim());
      setNewTaskText('');
    }
  };
  
  const handleToggleTask = (taskId: string, completed: boolean) => {
    updateTask(skillId, taskId, !completed);
  };
  
  const handleDeleteTask = (taskId: string) => {
    deleteTask(skillId, taskId);
  };
  
  return (
    <div className="space-y-4">
      <form onSubmit={handleAddTask} className="flex space-x-2">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task..."
          className="input flex-grow"
        />
        <button
          type="submit"
          disabled={!newTaskText.trim()}
          className="btn btn-primary"
        >
          <PlusCircle size={18} />
        </button>
      </form>
      
      {tasks.length > 0 ? (
        <ul className="space-y-2">
          {tasks.map(task => (
            <li
              key={task.id}
              className="flex items-center justify-between p-3 rounded-md bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <button
                  onClick={() => handleToggleTask(task.id, task.completed)}
                  className={`flex-shrink-0 ${
                    task.completed
                      ? 'text-success-500 hover:text-success-600'
                      : 'text-gray-400 hover:text-gray-500'
                  }`}
                >
                  {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                </button>
                <span className={`truncate ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                  {task.text}
                </span>
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-gray-400 hover:text-error-500 transition-colors ml-2"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400">No tasks yet</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;